const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

// Import endpoints
const users = require('./endpoints/users');

const app = express();

var corsOptions = {
    origin: "http://localhost:" + process.env.APP_PORT
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Init database
const db = require("./db/connection");

console.log("[INFO] Connecting to the Database (" + db.db + ") on port " + db.port + "...")
db.init()
.then(async () => {
    console.log("[INFO] Connection established!");
    
    // Start server only if DB was started correctly 
    app.listen(process.env.APP_PORT,() => {
        console.log("[INFO] Starting DataWarehouse Mkt API Server, listening on port " + process.env.APP_PORT);
    });

}).catch((err) => {
	console.log("[ERROR] While trying to connect to the Database", err);
});

// Main endpoint
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Mkt DataWarehouse API" });
});

// Users endpoint
app.use('/users', users);
