import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

const tripAccept = async (req, res) => {
    try {
        const { tripID, token } = req.body

        if (!tripID || !token) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }

        let connection;

        try {
            connection = await oracledb.getConnection(dbConfig);

            let query, options, result;
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `select USERNAME from EMPLOYEE where TOKEN = :1`;
            const getUserData = await connection.execute(query, [token], options);
            if (getUserData.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Something went wrong!!!\nplease refresh the page and Try Again",
                    status: "failure",
                    code: 400,
                });
            }

            const driverID = getUserData.rows[0].USERNAME;
            let acceptDateTime = new Date().toISOString();
            acceptDateTime = acceptDateTime.substring(0, acceptDateTime.length - 5).split('T');
            const acceptTripTime = `TIMESTAMP '${acceptDateTime[0]} ${acceptDateTime[1]}'`;

            query = `select * from cbs where tripid = '${tripID}' and status = 1`;
            result = await connection.execute(query);

            if (result.rows[0] !== undefined) {
                return res.send({
                    message: "🚨 Trip Already Booked\nYou Can Accept Another Trip If Available",
                    status: "failure",
                    code: 403,
                });
            }

            query = `update TRIP t
                        set DRIVERID = '${driverID}',
                        t.TRIP_TIME.END_DATETIME = ${acceptTripTime}
                    where TRIPID = '${tripID}'`;

            result = await connection.execute(query, [], { autoCommit: true });

            if (result.rowsAffected == 1) {
                query = `update CBS set STATUS = 1 where TRIPID = '${tripID}'`;
                result = await connection.execute(query, [], { autoCommit: true });

                if (result.rowsAffected == 1) {
                    return res.send({
                        message: "🎉 Trip Booked Accepted Successful...\nTrip fare added to your account",
                        status: "success",
                        code: 200,
                    });
                }

                return res.send({
                    message: "Trip Booked Accepted Successful...\nIssue with payment section. Contact administrator",
                    status: "success",
                    code: 201,
                });
            }

            return res.status(500).send({
                message: "Trip Booking Failed!!!",
                status: "failure",
                code: 500,
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

    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went Wrong!!!",
            status: "failure",
            code: 500,
        });
    }
}

export { tripAccept };