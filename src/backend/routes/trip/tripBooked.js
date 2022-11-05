import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

const bookingTrip = async (req, res) => {
    // console.log(req.body);

    try {
        const {
            startPlace, endPlace, startTime, ac, token
        } = req.body

        if (
            !startPlace ||
            !endPlace ||
            !startTime ||
            !ac ||
            !token
        ) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }
    }


    // else statement missing 
    //query


    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went Wrong!!!",
            status: "failure",
            code: 500,
        });
    }
};


export { bookingTrip };