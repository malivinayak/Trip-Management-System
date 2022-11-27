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

const customQuery = async (req, res) => {
    try {
        /**
         * @type {{customQuery:string}}
        */
        let { customQuery } = req.body;

        let connection;

        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);
            customQuery = customQuery.toLowerCase();
            customQuery = customQuery.trim();
            if (customQuery.endsWith(";"))
                customQuery = customQuery.substring(0, customQuery.length - 1);
            console.log(customQuery);
            if (customQuery.includes('insert into')) {
                return res.send({
                    message: "🚫 Read only access : Can not perform any write operation\n🔑 NOTE: Only SELECT Query can be performed",
                    status: "restricted",
                    code: 408,
                });
            } if (customQuery.includes('update') && customQuery.includes('set')) {
                return res.send({
                    message: "⚠️ Read only access : Can not perform any Manipulation operation\n🔑 NOTE: Only SELECT Query can be performed",
                    status: "restricted",
                    code: 408,
                });
            } if (customQuery.includes('create') ||
                customQuery.includes('alter')) {
                return res.send({
                    message: "⛔ Read only access : Can not perform any definition operation\n🔑 NOTE: Only SELECT Query can be performed",
                    status: "restricted",
                    code: 408,
                });
            } if (customQuery.includes('delete') ||
                customQuery.includes('truncate')) {
                return res.send({
                    message: "💀 Read only access : Can not perform any deletion operation\n🔑 NOTE: Only SELECT Query can be performed",
                    status: "restricted",
                    code: 408,
                });
            } if (customQuery.includes('grant') ||
                customQuery.includes('revoke')) {
                return res.send({
                    message: "☣ Read only access : Can not perform any control operation\n🔑 NOTE: Only SELECT Query can be performed",
                    status: "restricted",
                    code: 408,
                });
            } if (customQuery.includes('commit') ||
                customQuery.includes('rollback') ||
                customQuery.includes('save point')) {
                return res.send({
                    message: "☠ Read only access : Can not perform commit or rollback operation\n🔑 NOTE: Only SELECT Query can be performed",
                    status: "restricted",
                    code: 408,
                });
            }

            if (customQuery.includes('from user'))
                customQuery = customQuery.replace('from user', 'from CLIENT')
            if (customQuery.includes('from driver'))
                customQuery = customQuery.replace('from driver', 'from EMPLOYEE')

            const result = await connection.execute(customQuery);
            let retrievedData = [];
            result.rows?.forEach((row) => {
                let userInfo = {};
                result.metaData?.forEach((field, index) => {
                    userInfo[field.name.replace("_", " ")] = row[index];
                });
                retrievedData.push(userInfo);
            });

            if (retrievedData.length === 0) {
                return res.send({
                    message: "Data Retrieved ",
                    status: "success",
                    code: 200,
                    data: {
                        properties: [],
                        values: [],
                    },
                });
            }
            return res.send({
                message: "Data Retrieved ",
                status: "success",
                code: 200,
                data: {
                    properties: Object.getOwnPropertyNames(retrievedData[0]),
                    values: retrievedData,
                },
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "🙅 Looks like you entered wrong query\n\t" + err + "\nTRY again with proper syntax\n",
                status: "failure",
                code: 409,
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
            message: "Admin Access for Custom Query Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { customQuery };
