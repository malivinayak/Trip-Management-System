import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

const availableTrip = async (req, res) => {
    // console.log(req.body);

    try {
        const { token } = req.body

        if (!token) {
            console.log("Not all fields provided!!!");
            return res.status(400).send({
                message: "Not all fields provided!!!",
                status: "failure",
                code: 400,
            });
        }
        // else statement missing
        // query 


    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Something went Wrong!!!",
            status: "failure",
            code: 500,
        });
    }
};

export { availableTrip };