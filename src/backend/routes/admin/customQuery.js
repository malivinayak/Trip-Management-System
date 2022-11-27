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
        console.log(req.body);
        const { query } = req.body;

        let connection;

        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);
            while (query.endsWith(" "))
                query = query.substr(0, query.length - 1);
            if (query.endsWith(";"))
                query = query.substr(0, query.length - 1);

            const result = await connection.execute(query);
            var retrievedData = [];


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
