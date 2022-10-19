const express = require('express');

// ROUTES FUNCTIONS


// ---------------------------------
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1:${port}`);
});

// API ROUTES
app.get('/', function (req, res) {
    console.log("Vinayak");
    res.send("Done")
});

