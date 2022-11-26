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


            if (role === "user") {
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
            } else if (role === "driver") {
                query = `select WALLET_BALANCE from TRIP_MANAGEMENT_SYSTEM.TRIP where TOKEN = '${token}'`;
            }

            //query execution here
            const result = await connection.execute(query, [token]);

            let retrievedData = [];
            result.rows?.forEach((row) => {
                let userInfo = {};
                result.metaData?.forEach((field, index) => {
                    userInfo[field.name.replace("_", " ")] = row[index];
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

export { tripHistory };


/*
For User History
0. Match token in CLIENT and take USERNAME
1. take CBSID from USERTRIP -> Match with CBSID in CBS
2. take TRIPID from CBS -> Match with TRIPID in TRIP
3. take USERID from TRIP -> Match with USERID in CLIENT
4. take DRIVERID from TRIP -> Match with DRIVERID in EMPLOYEE

Display: TRIPID, Place(StartPlace, EndPlace), isAC, Vechical_type, startTime, status, trip_charge, driverName, driverPhone
*/

//take username using token with select query
/*
// when trip is not completed
let getTrip =
    `SELECT 
    t.TRIPID, 
    t.PLACE.pickup_place as Start_Place, 
    t.PLACE.drop_place as End_Place, 
    t.ISAC as AC, 
    t.VEHICAL_TYPE as Vehicle_Type, 
    c.STATUS as Trip_Status, 
    c.TRIP_CHARGE as Trip_Charge
FROM USERTRIP ut, CBS c, TRIP t, CLIENT u
where 
    u.TOKEN = ${token} and
    ut.CBSID = c.CBSID and
    c.TRIPID = t.TRIPID and
    t.USERID = u.USERID and
    c.STATUS = 0`;

// when trip is completed
getTrip =
    `SELECT 
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
    u.TOKEN = ${token} and
    t.USERID = u.USERID and
    ut.CBSID = c.CBSID and
    c.TRIPID = t.TRIPID and
    t.DRIVERID = d.DRIVERID and
    c.STATUS = 1`;
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