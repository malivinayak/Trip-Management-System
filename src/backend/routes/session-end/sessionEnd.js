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

const sessionEnd = async (req, res) => {
    // console.log(req.body);
    const roles = ["admin", "user", "driver"];

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

        let connection, resetTokenQuery, options;
        try {
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            };
            if (role === "user") {
                resetTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.client SET TOKEN = :1 WHERE USERID = :2`
            } else if (role === "driver") {
                resetTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.EMPLOYEE SET TOKEN = :1 WHERE USERID = :2`;
            } else {
                resetTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.ADMIN SET TOKEN = :1 WHERE USERID = :2`;
            }

            await connection.execute(resetTokenQuery, [null, userName], { autoCommit: true });

            return res.send({
                status: "success",
                code: 200,
                message: "Session ended successfully",
            });

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

export { sessionEnd };
