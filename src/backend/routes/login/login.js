import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';
import fs from 'fs';
import { randomBytes } from "crypto";

let libPath;
if (process.platform === 'win32') {           // Windows
    libPath = 'C:\\oracle\\instantclient_19_12';
} else if (process.platform === 'darwin') {   // macOS
    libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}
if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
}


const login = async (req, res) => {
    const roles = ["admin", "user", "driver"];

    try {
        const { userName, password } = req.body;
        let role = req.params.role;

        if (!userName || !password || !role) {
            return res.status(403).send({
                status: "failure",
                message: "All fields are required!!!",
                code: 403,
            });
        } else if (!roles.includes(role)) {
            return res.status(403).send({
                status: "failure",
                message: "Invalid role!!!",
                code: 403,
            });
        }

        let connection, query, options, result;
        // query
        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            };

            if (role === "user") {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.client where USERNAME = :1`
            } else if (role === "driver") {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.EMPLOYEE where USERNAME = :1`;
            } else {
                query = `select * from TRIP_MANAGEMENT_SYSTEM.ADMIN where USERNAME = :1`;
            }

            const results = await connection.execute(query, [userName], options);
            if (results.rows[0] === undefined) {
                return res.send({
                    status: "failure",
                    message: "This Username does NOT Exists!!!",
                    code: 400,
                });
            } else if (results.rows[0].TOKEN !== null) {
                let resetTokenQuery;
                if (role === "user") {
                    resetTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.client SET TOKEN = :2 WHERE USERID = :3`
                } else if (role === "driver") {
                    resetTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.EMPLOYEE SET TOKEN = :2 WHERE USERID = :3`;
                } else {
                    resetTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.ADMIN SET TOKEN = :2 WHERE USERID = :3`;
                }

                await connection.execute(resetTokenQuery, [null, userName], { autoCommit: true });

                return res.send({
                    status: "failure",
                    message: "Already logged in device detected!!!\nRefresh the page and login again",
                    code: 400,
                });
            } else if (results.rows[0].PASSWORD !== password) {
                return res.send({
                    status: "failure",
                    message: "Invalid Credentials!!!",
                    code: 400,
                });
            } else {
                const token = randomBytes(8).toString("hex");
                let setTokenQuery;
                if (role === "user") {
                    setTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.client SET TOKEN = :2 WHERE USERID = :3`
                } else if (role === "driver") {
                    setTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.EMPLOYEE SET TOKEN = :2 WHERE USERID = :3`;
                } else {
                    setTokenQuery = `UPDATE TRIP_MANAGEMENT_SYSTEM.ADMIN SET TOKEN = :2 WHERE USERID = :3`;
                }

                await connection.execute(setTokenQuery, [token, userName], { autoCommit: true });

                return res.send({
                    status: "success",
                    code: 200,
                    data: {
                        token: token,
                    },
                });
            }
        }

        catch (err) {
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
}

export { login };