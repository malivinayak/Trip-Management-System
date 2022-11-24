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

const getBalance = async (req, res) => {
    const roles = ["user", "driver"];

    try {
        const { token } = req.body;
        let role = req.params.role;
        console.log(req.body);
        if (!token) {
            return res.status(403).send({
                status: "failure",
                message: "Token not received!!!",
                code: 403,
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

            if (role === "user") {
                query = `select WALLET_BALANCE from TRIP_MANAGEMENT_SYSTEM.client where TOKEN = '${token}'`
            } else if (role === "driver") {
                query = `select WALLET_BALANCE from TRIP_MANAGEMENT_SYSTEM.EMPLOYEE where TOKEN = '${token}'`;
            }

            const result = await connection.execute(query);
            if (result.rows[0] === undefined) {
                return res.send({
                    status: "failure",
                    message: "Balance can no retrive at this time!!!",
                    code: 400,
                });
            }

            console.log(result.rows[0][0]);
            return res.send({
                message: "Data Retrieved ",
                status: "success",
                code: 200,
                data: {
                    "balance": result.rows[0][0],
                }
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
}

export { getBalance };