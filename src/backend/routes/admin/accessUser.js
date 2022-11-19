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

const userQuery = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "User Registration Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { userQuery };
