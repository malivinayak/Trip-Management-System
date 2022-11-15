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

const userRegistration = async (req, res) => {
    try {
        const { fname, mname, lname, userName, password, email, phone, dbo, gender, userID, houseNo, street, area, city, state, pincode, aadharNumber } =
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
            !userID ||
            !houseNo ||
            !street ||
            !area ||
            !city ||
            !state ||
            !pincode ||
            !aadharNumber
        ) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }

        let connection, query, options, result;

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
            query = `select USERNAME from client where USERNAME = :1`;

            const checkUserName = await connection.execute(query, [userName], options);

            if (checkUserName.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Username Already Taken!!!\nUse a different one.",
                    status: "failure",
                    code: 403,
                });
            }

            // Unique email
            query = `select EMAIL from client where EMAIL = :1`;
            const checkEmail = await connection.execute(query, [email], options);

            if (checkEmail.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Email is already registered!!!\nYou can either Login or Register with different username",
                    status: "failure",
                    code: 403,
                });
            }

            // Unique Phone Number
            query = `select PHONE from client where PHONE = :1`;
            const checkPhoneNumber = await connection.execute(query, [phone], options);

            if (checkPhoneNumber.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Phone Number is already registered!!!\nYou can either Login or Register with different username",
                    status: "failure",
                    code: 403,
                });
            }

            const WALLET_BALANCE = 0;

            result = await connection.execute(
                `INSERT INTO client(PERSON_NAME, USERNAME, PASSWORD, EMAIL, PHONE, DOB, GENDER, USERID, UADDRESS, AADHAR_NUMBER, WALLET_BALANCE) VALUES(new Name(:1,:2,:3), :4,:5,:6,:7,:8,:9,:10, new address(:11,:12,:13,:14,:15,:16), :17, :18 )`,
                [fname, mname, lname, userName, password, email, phone, dbo, gender, userID, houseNo, street, area, city, state, pincode, aadharNumber, WALLET_BALANCE],
                { autoCommit: true });

            return res.send({
                message: "User Registration Successful...",
                status: "success",
                code: 200,
            });

        } catch (err) {
            console.log(" Error at Data Base : " + err);
            return res.status(500).send({
                message: "User Registration Failed!!!",
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
            message: "User Registration Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { userRegistration };

// console.log(checkUserName.rows[0]['USERNAME']);


// console.log(checkUserName.metaData);
// // Data Print Format [ { name: 'FARMER' }, { name: 'PICKED' }, { name: 'RIPENESS' } ]
// console.log(checkUserName.rows);
// // Data Print Format [ [ 'Mindy', 2019-07-16T03:30:00.000Z, 'More Yellow than Green' ] ]