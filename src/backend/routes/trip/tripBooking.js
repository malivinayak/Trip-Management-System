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

const tripBooking = async (req, res) => {
    try {
        const { startPlace, endPlace, token } = req.body
        let { startTime, vehicleType, ac } = req.body;
        startTime = startTime.split("T");
        const startTripTime = `TIMESTAMP '${startTime[0]} ${startTime[1]}:00'`;

        if (
            !startPlace ||
            !endPlace ||
            !startTripTime ||
            !ac ||
            !vehicleType ||
            !token
        ) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }
        ac = parseInt(ac);
        let connection, query, options;

        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `select USERNAME,WALLET_BALANCE from client where TOKEN = :1`;

            const getUserData = await connection.execute(query, [token], options);
            if (getUserData.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Invalid Token",
                    status: "failure",
                    code: 400,
                });
            }

            const userID = getUserData.rows[0].USERNAME;
            const currentBalance = getUserData.rows[0].WALLET_BALANCE;
            const km = (Math.random() * 45) + 5;
            const fare = Math.round(km * (Math.floor(ac) ? 30 : 20));
            let tripID;
            vehicleType = vehicleType == '1' ? 'Taxi' : 'Private';

            if (fare >= currentBalance) {
                return res.send({
                    message: "Insufficient Balance...",
                    status: "failure",
                    code: 405,
                });
            }

            const insertQuery = `Insert into 
            TRIP(TRIPID, USERID, PLACE, ISAC, VEHICAL_TYPE, TRIP_TIME) 
            values('a','${userID}' ,new place('${startPlace}','${endPlace}'),'${ac}','${vehicleType}',new trip_time(${startTripTime},'')) 
            returning TRIPID into :tripID`;

            const bookTrip = await connection.execute(insertQuery,
                { tripID: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 } },
                { autoCommit: true },);
            tripID = bookTrip.outBinds.tripID[0];

            const insertCBS = `Insert into CBS values('a','${tripID}', 0,${fare},0,0)`;
            await connection.execute(insertCBS, [], { autoCommit: true },);
            const data = {
                tripID,
                km,
                ac,
                vehicleType,
                fare,
            };
            return res.send({
                message: "Trip Booked Successful...",
                status: "success",
                code: 200,
                data,
            });


        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Trip Booking Failed!!!",
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
            message: "Trip Booking Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { tripBooking };
