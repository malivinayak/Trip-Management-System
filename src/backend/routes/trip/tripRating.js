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

const tripRating = async (req, res) => {

    try {
        const { token, tripId, rating, feedback } = req.body;
        if (!token) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Token is required",
            });
        } if (!tripId || !rating) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "TripId and Rating is required",
            });
        }

        let connection;
        try {
            connection = await oracledb.getConnection(dbConfig);

            let query, options, result, retrievedData = [];
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `select USERNAME from CLIENT where TOKEN = :1`;
            const getUserData = await connection.execute(query, [token], options);
            if (getUserData.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Something went wrong!!!\nplease refresh the page and Try Again",
                    status: "failure",
                    code: 400,
                });
            }

            query = `select ISRATED from TRIP where TRIPID = :1 and USERID = '${getUserData.rows[0].USERNAME}'`;
            result = await connection.execute(query, [tripId], options);

            if (result.rows[0] === undefined) {
                return res.status(403).send({
                    message: "No such trip find\nPlease give a rating to different trip if available",
                    status: "failure",
                    code: 400,
                });
            } if (result.rows[0].ISRATED !== 0) {
                return res.status(403).send({
                    message: "This trip is already Rated\nPlease give a rating to different trip if available",
                    status: "failure",
                    code: 400,
                });
            }

            query = `update TRIP set ISRATED = ${rating} where TRIPID = '${tripId}'`;
            result = await connection.execute(query, [], { autoCommit: true });

            query = `insert into RATING values('${result.lastRowid}', '${tripId}', ${rating}, '${feedback}')`
            await connection.execute(query, [], { autoCommit: true });

            return res.send({
                message: "Trip Rated Successfully...",
                status: "success",
                code: 200,
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Trip rating Failed!!!",
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

export { tripRating };
