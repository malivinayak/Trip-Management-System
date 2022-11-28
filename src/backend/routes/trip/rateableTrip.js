import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';
import fs from 'fs';

let libPath;
if (process.platform === 'win32') {           // Windows
    libPath = 'C:\\oracle\\instantclient_19_12';
} else if (process.platform === 'darwin') {   // macOS
    libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}
if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
}

const rateableTrip = async (req, res) => {

    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Token is required",
            });
        }

        let connection;
        try {
            connection = await oracledb.getConnection(dbConfig);

            let query, options, result, retrievedData = [];
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `SELECT 
                        t.TRIPID, 
                        t.PLACE.pickup_place as Start_Place, 
                        t.PLACE.drop_place as End_Place, 
                        t.ISAC as AC, 
                        t.TRIP_TIME.start_dateTime as Start_Time,
                        t.TRIP_TIME.end_dateTime as End_Time,
                        t.VEHICAL_TYPE as Vehicle_Type,
                        c.TRIP_CHARGE as Trip_Charge,
                        CONCAT(d.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(d.PERSON_NAME.MNAME , CONCAT(' ', d.PERSON_NAME.LNAME)))) as Driver_Name,
                        d.PHONE as  Driver_Phone_Number
                    FROM CBS c, TRIP t, CLIENT u, EMPLOYEE d
                    where 
                        u.TOKEN = :1 and
                        t.USERID = u.USERID and
                        c.TRIPID = t.TRIPID and
                        t.DRIVERID = d.DRIVERID and
                        c.STATUS = 1 and
                        t.isRated = 0`;

            result = await connection.execute(query, [token]);
            result.rows?.forEach((row) => {
                let userInfo = {};
                result.metaData?.forEach((field, index) => {
                    userInfo[field.name.replaceAll("_", " ")] = row[index];
                });
                retrievedData.push(userInfo);
            });

            if (retrievedData.length === 0) {
                return res.send({
                    message: "No record found for Rating",
                    status: "success",
                    code: 205,
                    data: {
                        properties: [],
                        values: [],
                    },
                });
            }

            return res.send({
                message: "Data Retrieved ",
                status: "success",
                code: 200,
                data: {
                    properties: Object.getOwnPropertyNames(retrievedData[0]),
                    values: retrievedData,
                },
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Rateable trip list retrieval Failed!!!",
                status: "failure",
                code: 500,
            });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Connection Close Error :" + err);
                }
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went Wrong!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { rateableTrip };
