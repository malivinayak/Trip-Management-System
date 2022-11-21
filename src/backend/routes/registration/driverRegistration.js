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
        const { fname, mname, lname, userName, password, email, gender, houseNo, street, area, city, state, licenseNumber } =
            req.body;
        let { birthDate, phone, pincode, aadharNumber, expiryDate } = req.body;
        phone = parseInt(phone);
        pincode = parseInt(pincode);
        aadharNumber = parseInt(aadharNumber);
        expiryDate = new Date(expiryDate);
        let dbo = new Date(birthDate);
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
            !expiryDate
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
            };

            // Unique Username
            query = 'select USERNAME from EMPLOYEE where USERNAME = :1';

            const checkUserName = await connection.execute(query, [userName], options);
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

            // Unique aadhar
            query = `select AADHAR_NUMBER from EMPLOYEE where AADHAR_NUMBER = :1`;
            const checkaadharNumber = await connection.execute(query, [aadharNumber], options);

            if (checkaadharNumber.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "Aadhar Number is already registered!!!",
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
            query = `select LINCENCE_NUMBER from EMPLOYEE where LINCENCE_NUMBER = :1`;
            const checkLincenceNumber = await connection.execute(query, [licenseNumber], options);

            if (checkLincenceNumber.rows[0] !== undefined) {
                return res.status(403).send({
                    message: "",
                    status: "failure",
                    code: 403,
                });
            }

            const WALLET_BALANCE = 0, avgRating = 0, totalEarning = 0, DRIVERID = userName;

            result = await connection.execute(
                `INSERT INTO Employee(PERSON_NAME, USERNAME, PASSWORD, EMAIL, PHONE, DOB, GENDER,  DADDRESS, AADHAR_NUMBER, LINCENCE_NUMBER, EXP_DATE, AVG_RATING, TOTAL_EARING, WALLET_BALANCE, DRIVERID) VALUES(new Name(:1,:2,:3), :4,:5,:6,:7,:8,:9, new address(:10,:11,:12,:13,:14,:15), :16, :17, :18, :19, :20, :21, :22 )`,
                [fname, mname, lname, userName, password, email, phone, dbo, gender, houseNo, street, area, city, state, pincode, aadharNumber, licenseNumber, expiryDate, avgRating, totalEarning, WALLET_BALANCE, DRIVERID],
                { autoCommit: true });

            return res.send({
                message: "Driver Registration Successful...",
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