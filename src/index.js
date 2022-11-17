import express from 'express';

// ROUTES FUNCTIONS
// Sign Up
import { userRegistration } from "./backend/routes/registration/userRegistration.js";
import { driverRegistration } from "./backend/routes/registration/driverRegistration.js";
//Login
import { login } from "./backend/routes/login/login.js";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1:${port}`);
});

app.use(express.static("../public"));
app.use(express.json());
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// API ROUTES

// registration APIs
app.post("/api/registration/user", userRegistration);
app.post("/api/registration/driver", driverRegistration);

// login APIs
app.post("/api/login/:role", login);