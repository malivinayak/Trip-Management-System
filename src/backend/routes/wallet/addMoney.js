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

const addMoney = async (req, res) => {

    try {
        const { token, amount } = req.body;
        if (!token || !amount) {
            return res.status(403).send({
                status: "failure",
                message: "Token or amount not received!!!",
                code: 403,
            });
        }

        let connection, query;
        try {
            connection = await oracledb.getConnection(dbConfig);
            query = `update TRIP_MANAGEMENT_SYSTEM.client SET WALLET_BALANCE = ${amount} where TOKEN = '${token}'`
            console.log(query);
            await connection.execute(query);
            return res.send({
                message: "Balance Deposite success",
                status: "success",
                code: 200,
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Balance Deposite Failed!!!",
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

export { addMoney };









