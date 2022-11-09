import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

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

            // Unique Username
            const checkUserName = await connection.execute(
                // The statement to execute
                `SELECT userName
                FROM driver
                where username = :username`,
                [userName],
                {
                    maxRows: 1
                });
            console.log(checkUserName.metaData);
            // Data Print Format [ { name: 'FARMER' }, { name: 'PICKED' }, { name: 'RIPENESS' } ]
            console.log(checkUserName.rows);
            // Data Print Format [ [ 'Mindy', 2019-07-16T03:30:00.000Z, 'More Yellow than Green' ] ]
            if (checkUserName.rows == null) {
                return res.status(403).send({
                    message: "Username Already Taken!!!\nUse a different one.",
                    status: "failure",
                    code: 403,
                });
            }

            // Unique email
            const checkEmail = await connection.execute(
                // The statement to execute
                `SELECT userName
                FROM driver
                where email = :email`,
                [email],
                {
                    maxRows: 1
                });
            console.log(checkEmail.rows);
            if (checkEmail.rows == null) {
                return res.status(403).send({
                    message: "Email is already registered!!!\nYou can either Login or Register with different username",
                    status: "failure",
                    code: 403,
                });
            }

            // Unique Phone Number
            const checkPhoneNumber = await connection.execute(
                // The statement to execute
                `SELECT userName
                FROM driver
                where phone = :phone`,
                [phone],
                {
                    maxRows: 1
                });
            console.log(checkPhoneNumber.rows);
            if (checkPhoneNumber.rows == null) {
                return res.status(403).send({
                    message: "Phone Number is already registered!!!\nYou can either Login or Register with different username",
                    status: "failure",
                    code: 403,
                });
            }

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