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

const driverQuery = async (req, res) => {
    try {
        const { fname, mname, lname, gender, area, city, state } =
            req.body;
        let { pincode, ageR1, ageR2, earningR1, earningR2, expDate, ratingR1, ratingR2 } = req.body;
        pincode = parseInt(pincode);
        ageR1 = parseInt(ageR1);
        ageR2 = parseInt(ageR2);
        earningR1 = parseInt(earningR1);
        earningR2 = parseInt(earningR2);
        ratingR1 = parseFloat(ratingR1);
        ratingR2 = parseFloat(ratingR2);

        let connection, query;

        try {
            // DB Connection
            connection = await oracledb.getConnection(dbConfig);

            query = `select CONCAT(E.PERSON_NAME.FNAME , CONCAT(' ', CONCAT(E.PERSON_NAME.MNAME , CONCAT(' ', E.PERSON_NAME.LNAME)))) as Full_Name, GENDER as Gender, DOB as Birth_Date, E.AGE() as Age, EMAIL as Email, PHONE as Phone, AADHAR_NUMBER as Aadhar_Number, CONCAT(E.DADDRESS.houseNo, CONCAT(', ' , CONCAT(E.DADDRESS.street , CONCAT(', ' , CONCAT(E.DADDRESS.area , CONCAT(', ' , CONCAT(E.DADDRESS.city , CONCAT(', ' , CONCAT(E.DADDRESS.state , CONCAT(' - ' , E.DADDRESS.pincode)))))))))) as Address, LINCENCE_NUMBER as License_Number, EXP_DATE as Expiry_Date, AVG_RATING as Avg_Rating, TOTAL_EARING as Total_Earning from TRIP_MANAGEMENT_SYSTEM.EMPLOYEE E where `;
            query += fname ? `E.PERSON_NAME.FNAME like '%${fname}%' and ` : '';
            query += mname ? `E.PERSON_NAME.MNAME like '%${mname}%' and ` : '';
            query += lname ? `E.PERSON_NAME.LNAME like '%${lname}%' and ` : '';
            query += gender ? `GENDER='${gender}' and ` : '';
            query += ageR1 ? `E.age() >=${Math.floor(ageR1)} and ` : '';
            query += ageR2 ? `E.age() <=${Math.floor(ageR2)} and ` : '';
            query += area ? `E.DADDRESS.AREA like '%${area}%' and ` : '';
            query += city ? `E.DADDRESS.CITY like '%${city}%' and ` : '';
            query += state ? `E.DADDRESS.STATE like '%${state}%' and ` : '';
            query += pincode ? `E.DADDRESS.PINCODE like '%${pincode}%' and ` : '';
            query += earningR1 ? `TOTAL_EARING >=${Math.floor(earningR1)} and ` : '';
            query += earningR2 ? `TOTAL_EARING <=${Math.floor(earningR2)} and ` : '';
            query += ratingR1 ? `AVG_RATING >=${ratingR1} and ` : '';
            query += ratingR2 ? `AVG_RATING <=${ratingR2} and ` : '';

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
                    "License_Number": result.rows[i][8],
                    "Expiry_Date": result.rows[i][9],
                    "Avg_Rating": result.rows[i][10],
                    "Total_Earning": result.rows[i][11],
                }
                retrievedData.push(userInfo);
                i++;
            }
            if (result.rows[0] === undefined) {
                return res.send({
                    message: "No such Records Found",
                    status: "success",
                    code: 200,
                    data: {
                        properties: [],
                        values: [],
                    },
                });
            }
            return res.send({
                message: "Driver Data Retrieved Successfully",
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
                message: "Driver Access Failed!!!",
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
            message: "Driver Access Failed!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { driverQuery };
