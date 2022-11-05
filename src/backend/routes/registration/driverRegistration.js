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