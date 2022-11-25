import express from 'express';

// ROUTES FUNCTIONS

// Registration
import { userRegistration } from "./backend/routes/registration/userRegistration.js";
import { driverRegistration } from "./backend/routes/registration/driverRegistration.js";

// Login
import { login } from "./backend/routes/login/login.js";

// Credentials
import { credentials } from "./backend/routes/credentials/credentials.js";

// Session End
import { sessionEnd } from "./backend/routes/session-end/sessionEnd.js";

// Trip Function
import { tripBooking } from "./backend/routes/trip/tripBooking.js";
import { tripHistory } from "./backend/routes/trip/tripHistory.js";
import { tripAvailable } from "./backend/routes/trip/tripAvailable.js";
import { tripAccepting } from "./backend/routes/trip/tripAccepting.js";
import { tripRating } from "./backend/routes/trip/tripRating.js";

// Admin Queries
import { userQuery } from "./backend/routes/admin/accessUser.js";
import { driverQuery } from "./backend/routes/admin/accessDriver.js";
import { tripQuery } from "./backend/routes/admin/accessTrip.js";
import { customQuery } from "./backend/routes/admin/customQuery.js";

// Wallet
import { addMoney } from "./backend/routes/wallet/addMoney.js";
import { withdrawMoney } from "./backend/routes/wallet/withdrawMoney.js";
import { getBalance } from "./backend/routes/wallet/getBalance.js";

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

// session-end APIs
app.post("/api/session-end/:role", sessionEnd);

// credentials APIs
app.post("/api/credentials/:role", credentials);

// admin query APIs
app.post("/api/query/user", userQuery);
app.post("/api/query/driver", driverQuery);
app.post("/api/query/trip", tripQuery);
app.post("/api/query/custom", customQuery);

// trip APIs
app.post("/api/trip/booking", tripBooking);
app.post("/api/trip/history/:role", tripHistory);
app.post("/api/trip/available", tripAvailable);
app.post("/api/trip/accepting", tripAccepting);
app.post("/api/trip/rating", tripRating);

//Wallet APIs
app.post("/api/wallet/addMoney", addMoney);
app.post("/api/wallet/withdrawMoney", withdrawMoney);
app.post("/api/cbs/get-balance/:role", getBalance);
