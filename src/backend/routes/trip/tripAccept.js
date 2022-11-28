import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

const tripAccept = async (req, res) => {
    // console.log(req.body);


    try {
        const { tripID, token } = req.body

        if (!tripID || !token) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }
        // else statement missing
        // check here properly if else statement // else statement 
        else {
            return res.send({
                message: "Invalid Trip ID...",
                status: "failure",
                code: 400,
            });
        }
    }


    // query 


    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went Wrong!!!",
            status: "failure",
            code: 500,
        });
    }
}

export { tripAccept };