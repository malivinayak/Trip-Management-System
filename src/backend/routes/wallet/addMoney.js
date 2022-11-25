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
        const { token } = req.body;
        let { amount } = req.body;
        amount = parseInt(amount)
        if (amount < 10) {
            return res.status(403).send({
                status: "failure",
                message: "Minimum amount must be 10!!!",
                code: 407,
            });
        }
        if (!token || !amount) {
            return res.status(403).send({
                status: "failure",
                message: "Token or amount not received!!!",
                code: 403,
            });
        }

        let connection, query, options;
        try {
            connection = await oracledb.getConnection(dbConfig);

            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            const getBalQuery = `select WALLET_BALANCE from TRIP_MANAGEMENT_SYSTEM.client where TOKEN = :1`;
            const getCurrentBalance = await connection.execute(getBalQuery, [token], options);
            if (getCurrentBalance.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Invalid Token",
                    status: "failure",
                    code: 400,
                });
            }
            let currentBalance = getCurrentBalance.rows[0].WALLET_BALANCE;
            currentBalance = currentBalance + amount;

            query = `update TRIP_MANAGEMENT_SYSTEM.client SET WALLET_BALANCE = ${currentBalance} where TOKEN = '${token}'`;
            await connection.execute(query, [], { autoCommit: true });
            return res.send({
                message: `🎉Balance Deposited success.......
To Check updated balance click "Get Wallet Balance" button again`,
                status: "success",
                code: 200,
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Balance Deposit Failed!!!",
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
