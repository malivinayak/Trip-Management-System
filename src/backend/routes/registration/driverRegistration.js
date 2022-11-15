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

const driverRegistration = async (req, res) => {
    try {
        const { fname, mname, lname, userName, password, email, phone, dbo, gender, houseNo, street, area, city, state, pincode, aadharNumber, licenseNumber, expDate } =
            req.body;

        if (
            !fname ||
            !mname ||
            !lname ||
            !userName ||
            !password ||
            !email ||
            !phone ||
            !dbo ||
            !gender ||
            !houseNo ||
            !street ||
            !area ||
            !city ||
            !state ||
            !pincode ||
            !aadharNumber ||
            !licenseNumber ||
            !expDate
        ) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }

        let connection, query, bind, options, result;
        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                // extendedMetaData: true,               // get extra metadata
                // prefetchRows:     100,                // internal buffer allocation size for tuning
                // fetchArraySize:   100                 // internal buffer allocation size for tuning
            };

            // Unique Username
            query = 'select USERNAME from EMPLOYEE where USERNAME = :1';

            const checkUserName = await connection.execute(query,[userName],options);
            if (checkUserName.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Username Already Taken!!!\nUse a different one.",
                    status: "failure",
                    code: 403,
                });
            }

            // Unique email
            query = `select EMAIL from EMPLOYEE where EMAIL = :1`;
            const checkEmail = await connection.execute(query, [email], options);

            if (checkEmail.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Email is already registered!!!\nYou can either Login or Register with different username",
                    status: "failure",
                    code: 403,
                });
            }

            // Unique Phone Number
            query = `select PHONE from EMPLOYEE where PHONE = :1`;
            const checkPhoneNumber = await connection.execute(query, [phone], options);

            if (checkPhoneNumber.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Phone Number is already registered!!!\nYou can either Login or Register with different username",
                    status: "failure",
                    code: 403,
                });
            }
            // Unique Lincence_Number
            query = `select Lincence_Number from EMPLOYEE where Lincence_Number = :1`;
            const checkLincenceNumber = await connection.execute(query, [licenseNumber], options);

            if (checkLincenceNumber.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "",
                    status: "failure",
                    code: 403,
                });
            }

            const WALLET_BALANCE = 0;

            query = `insert into driver values(:1,:2)`;
            bind = [fname, mname, lname];
            options = {
                bindDefs: [
                    { type: oracledb.STRING },
                    { type: oracledb.STRING, maxSize: 50 }
                ]
            };
            result = await connection.executeMany(query, bind, options);

            console.log("Number of rows inserted:", result.rowsAffected);

            return res.send({
                message: "User Registration Successful...",
                status: "success",
                code: 200,
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "Driver Registration Failed!!!",
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
            message: "Driver Registration Failed!!!",
            status: "failure",
            code: 500,
        });
    }
}

export { driverRegistration };