const oracledb = require("oracledb");
const dbconfig = require("./dbconfig.js");
const dotenv = require("dotenv");
dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function fun() {
    let con;
    try {
        con = await oracledb.getConnection({ dbconfig });

        const data = await con.execute(
            `select * from book`,
        );
        console.log(data.rows);
    }
    catch (err) {
        console.log(`Error Ocurred : ` + err)
    }
}

fun();