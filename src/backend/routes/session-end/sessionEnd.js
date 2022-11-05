import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

const sessionEnd = async (req, res) => {
    // console.log(req.body);
    const roles = ["admin", "user", "driver"];

    try {
        const { token } = req.body;
        const role = req.params.role;

        if (!token || !role) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Token is required",
            });
        } else if (!roles.includes(role)) {
            return res.status(403).send({
                status: "failure",
                message: "Invalid role!!!",
                code: 403,
            });
        }
    }

    //else statement missing
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

export { sessionEnd };
