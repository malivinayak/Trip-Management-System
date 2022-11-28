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
        const { token } = req.body;
        console.log(req.body);
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

            return res.send({
                message: "Data Retrieved ",
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
