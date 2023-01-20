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

const tripHistory = async (req, res) => {
    // console.log(req.body);
    const roles = ["user", "driver"];

    try {
        const { token } = req.body;
        const role = req.params.role;

        if (!token || !role) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Token is required",
            });
        } else if (!roles.includes(role)) {
            return res.status(403).send({
                status: "failure",
                message: "Invalid role!!!",
                code: 403,
            });
        }

        let connection, query, options;
        try {
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            let retrievedData = [], result;
            if (role === "user") {
                query = `SELECT 
                            t.TRIPID, 
                            t.PLACE.pickup_place as Start_Place, 
                            t.PLACE.drop_place as End_Place, 
                            t.ISAC as AC, 
                            t.VEHICAL_TYPE as Vehicle_Type, 
                            c.STATUS as Trip_Status, 
                            c.TRIP_CHARGE as Trip_Charge
                        FROM USERTRIP ut, CBS c, TRIP t, CLIENT u
                        where 
                            u.TOKEN = :1 and
                            t.USERID = u.USERID and
                            ut.CBSID = c.CBSID and
                            c.TRIPID = t.TRIPID and
                            c.STATUS = 0`;
                result = await connection.execute(query, [token]);
                result.rows?.forEach((row) => {
                    let userInfo = {};
                    result.metaData?.forEach((field, index) => {
                        userInfo[field.name.replaceAll("_", " ")] = row[index];
                    });
                    userInfo['DRIVER NAME'] = 'Not Assigned';
                    userInfo['DRIVER PHONE NUMBER'] = 'Not Assigned';
                    retrievedData.push(userInfo);
                });

                query = `SELECT 
                            t.TRIPID, 
                            t.PLACE.pickup_place as Start_Place, 
                            t.PLACE.drop_place as End_Place, 
                            t.ISAC as AC, 
                            t.VEHICAL_TYPE as Vehicle_Type, 
                            c.STATUS as Trip_Status, 
                            c.TRIP_CHARGE as Trip_Charge,
                            CONCAT(d.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(d.PERSON_NAME.MNAME , CONCAT(' ', d.PERSON_NAME.LNAME)))) as Driver_Name,
                            d.PHONE as  Driver_Phone_Number
                        FROM USERTRIP ut, CBS c, TRIP t, CLIENT u, EMPLOYEE d
                        where 
                            u.TOKEN = :1 and
                            t.USERID = u.USERID and
                            ut.CBSID = c.CBSID and
                            c.TRIPID = t.TRIPID and
                            t.DRIVERID = d.DRIVERID and
                            c.STATUS = 1`;
                result = await connection.execute(query, [token]);
                result.rows?.forEach((row) => {
                    let userInfo = {};
                    result.metaData?.forEach((field, index) => {
                        userInfo[field.name.replaceAll("_", " ")] = row[index];
                    });
                    retrievedData.push(userInfo);
                });
            } else if (role === "driver") {
                query = `SELECT 
                t.TRIPID, 
                t.PLACE.pickup_place as Start_Place, 
                t.PLACE.drop_place as End_Place, 
                t.ISAC as AC, 
                t.VEHICAL_TYPE as Vehicle_Type, 
                t.TRIP_TIME.start_dateTime as Start_Time,
                t.TRIP_TIME.end_dateTime as Accept_Time,
                c.STATUS as Trip_Status, 
                c.RENT as Trip_Charge,
                c.REWARD as Reward,
                CONCAT(u.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(u.PERSON_NAME.MNAME , CONCAT(' ', u.PERSON_NAME.LNAME)))) as User_Name,
                u.PHONE as  User_Phone_Number
            FROM 
                DRIVETRIP dt, CBS c, TRIP t, CLIENT u, EMPLOYEE d
            WHERE 
                d.TOKEN = :1 and
                t.DRIVERID = d.DRIVERID and
                dt.CBSID = c.CBSID and
                c.TRIPID = t.TRIPID and
                t.USERID = u.USERID`;
                result = await connection.execute(query, [token]);
                result.rows?.forEach((row) => {
                    let userInfo = {};
                    result.metaData?.forEach((field, index) => {
                        userInfo[field.name.replaceAll("_", " ")] = row[index];
                    });
                    retrievedData.push(userInfo);
                });
            }

            if (retrievedData.length === 0) {
                return res.send({
                    message: "No record found ",
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

export { tripHistory };
