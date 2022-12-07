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

const tripAvailable = async (req, res) => {
    // console.log(req.body);

    try {
        const { token } = req.body

        if (!token) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }

        let connection;
        try {
            let query, options, result, retrievedData = [];
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `select * from TRIP_MANAGEMENT_SYSTEM.EMPLOYEE where TOKEN = :1`;
            const getCurrentBalance = await connection.execute(query, [token], options);
            if (getCurrentBalance.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Something went wrong!!!\nplease refresh the page and retry",
                    status: "failure",
                    code: 400,
                });
            }

            query = `SELECT 
                        t.TRIPID, 
                        t.TRIP_TIME.start_dateTime as Start_Date_Time,
                        t.PLACE.pickup_place as Start_Place, 
                        t.PLACE.drop_place as End_Place,
                        c.TRIP_CHARGE as Rent,
                        CONCAT(u.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(u.PERSON_NAME.MNAME , CONCAT(' ', u.PERSON_NAME.LNAME)))) as Client_Name,
                        u.PHONE as Client_Phone_Number
                    FROM CBS c, TRIP t, CLIENT u, EMPLOYEE d
                    where 
                        d.TOKEN = :1 and
                        c.STATUS = 0 and
                        c.TRIPID = t.TRIPID and
                        t.USERID = u.USERID
                        `;

            result = await connection.execute(query, [token]);
            result.rows?.forEach((row) => {
                let userInfo = {};
                result.metaData?.forEach((field, index) => {
                    if (field.name == 'RENT') {
                        row[index] = parseInt(row[index] - (row[index] * .10));
                    };
                    userInfo[field.name.replaceAll("_", " ")] = row[index];
                });
                retrievedData.push(userInfo);
            });

            if (result.rows[0] === undefined) {
                return res.send({
                    message: "Data Retrieved ",
                    status: "success",
                    code: 200,
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
                message: "Balance Retrieval Failed!!!",
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

export { tripAvailable };


/*
query = `SELECT 
                        t.TRIPID, 
                        t.PLACE.pickup_place as Start_Place, 
                        t.PLACE.drop_place as End_Place,
                        c.TRIP_CHARGE as Rent
                    FROM VEHICAL v, CBS c, TRIP t, CLIENT u, EMPLOYEE d
                    where 
                        d.TOKEN = :1 and
                        v.DRIVERID = d.DRIVERID and
                        c.STATUS = 0 and
                        t.VEHICAL_TYPE = v.VEHICAL_TYPE and
                        t.ISAC = v.ISAC and
                        t.USERID = u.USERID and
                        c.TRIPID = t.TRIPID and
                        `;

*/
