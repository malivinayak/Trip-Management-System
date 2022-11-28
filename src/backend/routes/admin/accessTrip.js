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

const tripQuery = async (req, res) => {
    try {

        const { place1, place2, userName, driverName } = req.body;
        let { startDateTime1, startDateTime2, endDateTime1, endDateTime2, status, ac, fareR1, fareR2 } = req.body;

        let dateTime;
        let startTripTime1, startTripTime2, endTripTime1, endTripTime2;
        if (startDateTime1) {
            dateTime = startDateTime1.split("T");
            startTripTime1 = `TIMESTAMP '${dateTime[0]} ${dateTime[1]}:00'`;
        } if (startDateTime2) {
            dateTime = startDateTime2.split("T");
            startTripTime2 = `TIMESTAMP '${dateTime[0]} ${dateTime[1]}:00'`;
        } if (endDateTime1) {
            dateTime = endDateTime1.split("T");
            endTripTime1 = `TIMESTAMP '${dateTime[0]} ${dateTime[1]}:00'`;
        } if (endDateTime2) {
            dateTime = endDateTime2.split("T");
            endTripTime2 = `TIMESTAMP '${dateTime[0]} ${dateTime[1]}:00'`;
        }

        let connection;
        try {
            connection = await oracledb.getConnection(dbConfig);
            let query, result, retrievedData = [], options;
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `SELECT 
                        t.TRIPID, 
                        t.PLACE.pickup_place as Start_Place, 
                        t.PLACE.drop_place as End_Place, 
                        t.ISAC as AC, 
                        t.VEHICAL_TYPE as Vehicle_Type,  
                        t.TRIP_TIME.start_dateTime as Start_Time,
                        t.TRIP_TIME.end_dateTime as Accept_Time,
                        c.STATUS as Trip_Status, 
                        c.RENT as RENT,
                        c.REWARD as Reward,
                        c.TRIP_CHARGE as Trip_Charge,
                        CONCAT(d.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(d.PERSON_NAME.MNAME , CONCAT(' ', d.PERSON_NAME.LNAME)))) as Driver_Name,
                        d.PHONE as  Driver_Phone_Number,
                        CONCAT(u.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(u.PERSON_NAME.MNAME , CONCAT(' ', u.PERSON_NAME.LNAME)))) as User_Name,
                        u.PHONE as  User_Phone_Number
                    FROM 
                        CBS c, 
                        TRIP t, 
                        CLIENT u,
                        EMPLOYEE d
                    where 
                        t.USERID = u.USERID and
                        t.DRIVERID = d.DRIVERID and
                        c.TRIPID = t.TRIPID and 
                        `;

            query += userName ? `t.USERID = '${userName}' and ` : '';
            query += driverName ? `t.DRIVERID = '${driverName}' and ` : '';
            query += place1 ? `t.PLACE.pickup_place like '%${place1}%' and ` : '';
            query += place2 ? `t.PLACE.drop_place like '%${place2}%' and ` : '';
            query += ac != '' ? `c.STATUS = ${ac} and ` : '';
            query += status ? `t.ISstatus = ${status} and ` : '';
            query += fareR1 ? `c.TRIP_CHARGE >= ${Math.floor(fareR1)} and ` : '';
            query += fareR2 ? `c.TRIP_CHARGE <= ${Math.floor(fareR2)} and ` : '';
            query += startDateTime1 ? `t.TRIP_TIME.start_dateTime >= ${startTripTime1} and ` : '';
            query += startDateTime2 ? `t.TRIP_TIME.start_dateTime <= ${startTripTime2} and ` : '';
            query += endDateTime1 ? `t.TRIP_TIME.end_dateTime >= ${endTripTime1} and ` : '';
            query += endDateTime2 ? `t.TRIP_TIME.end_dateTime <= ${endTripTime2} and ` : '';

            query = query.trim();
            if (query.endsWith("and"))
                query = query.substring(0, query.length - 4);

            result = await connection.execute(query);
            result.rows?.forEach((row) => {
                let userInfo = {};
                result.metaData?.forEach((field, index) => {
                    userInfo[field.name.replaceAll("_", " ")] = row[index];
                });
                retrievedData.push(userInfo);
            });

            if (retrievedData.length === 0) {
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
                message: "Trip History can not get at this time\nTry again later!!!",
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
            message: "Something went Wrong!!!\nTrip History can not get at this time\nTry again later",
            status: "failure",
            code: 500,
        });
    }
};

export { tripQuery };
