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
            customQuery = customQuery.trim();
            if (customQuery.endsWith(";"))
                customQuery = customQuery.substring(0, customQuery.length - 1);

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
                message: "Admin Access for Custom Query Failed due to DB Error!!!\n" + err,
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
            message: "Admin Access for Custom Query Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { customQuery };
