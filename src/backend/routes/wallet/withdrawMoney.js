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

const withdrawMoney = async (req, res) => {
    try {
        const { token } = req.body;
        let { amount } = req.body;
        amount = parseInt(amount);
        if (amount < 100) {
            return res.status(403).send({
                status: "failure",
                message: "Minimum withdrawal amount must be 100!!!",
                code: 407,
            });
        } else if (amount > 10000) {
            return res.status(403).send({
                status: "failure",
                message: "You can not withdrawal more than 10k in single transaction!!!",
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

            const getBalQuery = `select WALLET_BALANCE from TRIP_MANAGEMENT_SYSTEM.EMPLOYEE where TOKEN = :1`;
            const getUserData = await connection.execute(getBalQuery, [token], options);
            if (getUserData.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Invalid Token",
                    status: "failure",
                    code: 400,
                });
            }
            let currentBalance = getUserData.rows[0].WALLET_BALANCE;
            if (amount >= currentBalance) {
                return res.send({
                    message: "Insufficient Balance...",
                    status: "failure",
                    code: 405,
                });
            }

            currentBalance = currentBalance - amount;
            const updateBalance = `update TRIP_MANAGEMENT_SYSTEM.EMPLOYEE SET WALLET_BALANCE = ${currentBalance} where TOKEN = '${token}'`
            await connection.execute(updateBalance, [], { autoCommit: true });
            return res.send({
                message: `🎉Balance withdrawal successful.......
To Check updated balance click "Get Wallet Balance" button again`,
                status: "success",
                code: 200,
            });
        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Balance withdraw Failed!!!",
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

export { withdrawMoney };
