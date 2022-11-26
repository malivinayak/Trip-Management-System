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

const deleteTripHistory = async (req, res) => {
    console.log("Deletign TRIP History");
    const roles = ["user", "driver"];

    try {
        const { token } = req.body;
        const role = req.params.role;

        if (!token || !role) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Token is required",
            });
        } else if (!roles.includes(role)) {
            return res.status(403).send({
                status: "failure",
                message: "Invalid role!!!",
                code: 403,
            });
        }

        let connection;
        try {
            connection = await oracledb.getConnection(dbConfig);
            let query, result;

            if (role === "user") {
                query = `delete from USERTRIP 
                        where USERTRIP.CBSID IN (
                            Select c.CBSID from CBS c, Client u, Trip t
                            where t.TRIPID = c.TRIPID and
                            u.USERID = t.USERID and
                            u.TOKEN = '${token}'
                        )`;
            } else if (role === "driver") {
                query = `TRUNCATE TABLE DRIVETRIP`;
            }

            result = await connection.execute(query, [], { autoCommit: true });
            console.log(result);
            return res.send({
                message: "Data deleted successfully",
                status: "success",
                code: 200,
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Deletion Failed!!!\nTry after some time",
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
};

export { deleteTripHistory };