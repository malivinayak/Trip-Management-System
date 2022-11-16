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


const login = async (req, res) => {
    // console.log(req.body);
    const roles = ["admin", "user", "driver"];

    try {
        const { userName, password } = req.body;
        const role = req.params.role;

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

            query = `SELECT * FROM :role where userName = :userName`;
            const results = await connection.execute(query, [role,userName], options);

            if (results.length === 0) {
                return res.send({
                    status: "failure",
                    message: "This Username does NOT Exists!!!",
                    code: 400,
                });
            } else if (results[0].token !== null) {
                return res.send({
                    status: "failure",
                    message: "Already logged in!!!\nTry After logout from other device",
                    code: 400,
                });
            } else if (results[0].password !== password) {
                return res.send({
                    status: "failure",
                    message: "Invalid Credentials!!!",
                    code: 400,
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