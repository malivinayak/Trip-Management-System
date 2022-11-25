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
        if (amount < 10) {
            return res.status(403).send({
                status: "failure",
                message: "Minimum withdrawal amount must be 10!!!",
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


        let connection, query;
        try {
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            };

            query = `select WALLET_BALANCE from EMPLOYEE where TOKEN = :1`;

            const getUserData = await connection.execute(query, [token], options);
            if (getUserData.rows[0] === undefined) {
                return res.status(403).send({
                    message: "Invalid Token",
                    status: "failure",
                    code: 400,
                });
            }
            const currentBalance = getUserData.rows[0].WALLET_BALANCE;

            if (amount >= currentBalance) {
                return res.send({
                    message: "Insufficient Balance...",
                    status: "failure",
                    code: 405,
                });
            }

            currentBalance = currentBalance - amount;
            const updateBalance = `update TRIP_MANAGEMENT_SYSTEM.EMPLOYEE SET WALLET_BALANCE = ${currentBalance} where TOKEN = '${token}'`
            // console.log(query);
            await connection.execute(updateBalance);
            return res.send({
                message: "Balance withdraw success",
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
