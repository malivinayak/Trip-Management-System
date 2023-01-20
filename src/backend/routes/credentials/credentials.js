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


const credentials = async (req, res) => {
    // console.log(req.body);
    const roles = ["admin", "user", "driver"];

    try {
        const { token } = req.body;
        const role = req.params.role;

        if (!token || !role) {
            return res.status(400).send({
                status: "failure",
                message: "Token is required",
                code: 400,
            });
        } else if (!roles.includes(role)) {
            return res.status(403).send({
                status: "failure",
                message: "Invalid role!!!",
                code: 403,
            });
        }

        let connection, query, options, results;

        try {
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            if (role === "user") {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.client where TOKEN = :1`
            } else if (role === "driver") {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.EMPLOYEE where TOKEN = :1`;
            } else {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.ADMIN where TOKEN = :1`;
            }

            results = await connection.execute(query, [token], options);
            if (results.rows[0] === undefined) {
                return res.send({
                    status: "failure",
                    message: "Invalid Token!!!",
                    code: 400,
                });
            } else {
                return res.send({
                    status: "success",
                    code: 200,
                    data: {
                        userName: results.rows[0].USERNAME,
                    },
                });
            }
        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Login Failed!!!",
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

export { credentials };