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

            //change query s per DB personal history

            /*
            For User History
            0. Match token in CLIENT and take USERNAME
            1. take CBSID from USERTRIP -> Match with CBSID in CBS
            2. take TRIPID from CBS -> Match with TRIPID in TRIP
            3. take USERID from TRIP -> Match with USERID in CLIENT
            4. take DRIVERID from TRIP -> Match with DRIVERID in EMPLOYEE
            
            Display: TRIPID, Place(StartPlace, EndPlace), isAC, Vechical_type, startTime, status, trip_charge, driverName, driverPhone
            */

            /*
            For Driver History
            0. Match token in EMPLOYEE and take DRIVERID
            1. take CBSID from DRIVETRIP -> Match with CBSID in CBS
            2. take TRIPID from CBS -> Match with TRIPID in TRIP
            3. take DRIVERID from TRIP -> Match with DRIVERID in CLIENT
            4. take USERID from TRIP -> Match with USERID in CLIENT
            5. take TRIPID from TRIP -> MATCH with TRIPID in RATING
            
            Display: TRIPID, Place(StartPlace, EndPlace), isAC, Vechical_type, startTime, status, rent, reward, rating, description 
            */

            if (role === "user") {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.TRIP where TOKEN = '${token}'`
            } else if (role === "driver") {
                query = `select WALLET_BALANCE from TRIP_MANAGEMENT_SYSTEM.TRIP where TOKEN = '${token}'`;
            }

            //query execution here


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

export { tripHistory };