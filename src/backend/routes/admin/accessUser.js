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
        const { fname, mname, lname, gender, area, city, state } =
            req.body;
        let { pincode, ageR1, ageR2, birthDateR1, birthDateR2 } = req.body;
        pincode = parseInt(pincode);
        ageR1 = parseInt(ageR1);
        ageR2 = parseInt(ageR2);
        birthDateR1 = new Date(birthDateR1);
        birthDateR2 = new Date(birthDateR2);

        let connection, query, options;

        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);

            query = `select CONCAT(c.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(c.PERSON_NAME.MNAME , CONCAT(' ', c.PERSON_NAME.LNAME)))) as Full_Name, GENDER as Gender, DOB as Birth_Date, c.AGE() as Age, EMAIL as Email, PHONE as Phone, AADHAR_NUMBER as Aadhar_Number, CONCAT(c.UADDRESS.houseNo, CONCAT(', ' , CONCAT(c.UADDRESS.street , CONCAT(', ' , CONCAT(c.UADDRESS.area , CONCAT(', ' , CONCAT(c.UADDRESS.city , CONCAT(', ' , CONCAT(c.UADDRESS.state , CONCAT(' - ' , c.UADDRESS.pincode)))))))))) as Address from TRIP_MANAGEMENT_SYSTEM.client c where `;
            query += fname ? `c.PERSON_NAME.FNAME like '%${fname}%' and ` : '';
            query += mname ? `c.PERSON_NAME.MNAME like '%${mname}%' and ` : '';
            query += lname ? `c.PERSON_NAME.LNAME like '%${lname}%' and ` : '';
            query += gender ? `GENDER='${gender}' and ` : '';
            query += ageR1 ? `c.age() >=${Math.floor(ageR1)} and ` : '';
            query += ageR2 ? `c.age() <=${Math.floor(ageR2)} and ` : '';
            query += area ? `c.UADDRESS.AREA like '%${area}%' and ` : '';
            query += city ? `c.UADDRESS.CITY like '%${city}%' and ` : '';
            query += state ? `c.UADDRESS.STATE like '%${state}%' and ` : '';
            query += pincode ? `c.UADDRESS.PINCODE like '%${pincode}%' and ` : '';

            if (query.endsWith("and "))
                query = query.substr(0, query.length - 4);
            else if (query.endsWith("where "))
                query = query.substr(0, query.length - 6);

            const result = await connection.execute(query);

            let i = 0;
            var retrievedData = [];
            while (result.rows[i] !== undefined) {
                var userInfo = {
                    "Full_Name": result.rows[i][0],
                    "Gender": result.rows[i][1],
                    "Birth_Date": result.rows[i][2],
                    "Age": result.rows[i][3],
                    "Email": result.rows[i][4],
                    "Phone": result.rows[i][5],
                    "Aadhar_Number": result.rows[i][6],
                    "Address": result.rows[i][7],
                }
                retrievedData.push(userInfo);
                i++;
            }
            if (result.rows[0] === undefined) {
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
                message: "User Access Failed!!!",
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
            message: "User Access Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { userQuery };



// query = `select CONCAT(c.PERSON_NAME.fname , CONCAT(' ', CONCAT(c.PERSON_NAME.mname , CONCAT(' ', c.PERSON_NAME.lname)))) as Full_Name ,EMAIL ,PHONE ,DOB ,c.AGE() ,c.UADDRESS.PINCODE from TRIP_MANAGEMENT_SYSTEM.client c`;
// const test = await connection.execute(query);
// console.log(test);
