import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();
// require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    insecureAuth: true,
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

export { connection };