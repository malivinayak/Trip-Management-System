import oracledb from 'oracledb';
import { dbConfig } from '../../dbconfig.js';

const login = async (req, res) => {
    // console.log(req.body);
    const roles = ["admin", "user", "driver"];

    try {
        const { userName, password } = req.body;
        const role = req.params.role;

        if (!userName || !password || !role) {
            return res.status(403).send({
                status: "failure",
                message: "All fields are required!!!",
                code: 403,
            });
        } else if (!roles.includes(role)) {
            return res.status(403).send({
                status: "failure",
                message: "Invalid role!!!",
                code: 403,
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
}

export { login };