const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const helmet = require('helmet');
require('dotenv').config();


// Import endpoints
const users = require('./endpoints/users');
const companies = require('./endpoints/companies');
const contacts = require('./endpoints/contacts');
const regions = require('./endpoints/regions');
const countries = require('./endpoints/countries');
const cities = require('./endpoints/cities');

const app = express();

var corsOptions = {
    origin: '*'
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet.permittedCrossDomainPolicies({permittedPolicies: "by-content-type"}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Init database
const { db, dbURI } = require('./db/connection');
const bulkInitData = require('./db/bulkInitData');

console.log("[INFO] Connecting to the Database...");
db.once('open', ()=> {
    console.log("[INFO] Database connected to " + dbURI);
    // Bulk init entries
    bulkInitData();

    app.listen(process.env.APP_PORT, () => {
        console.log("[INFO] Starting Datawarehouse Mkt API Server, listening on port " + process.env.APP_PORT);
    });
});
db.on('error', console.error.bind(console, 'Connection error'));

// Main endpoint
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Mkt DataWarehouse API" });
});

// Users endpoint
app.use('/users', users);
// Companies endpoint
app.use('/companies', companies);
// Contacts endpoint
app.use('/contacts', contacts);
// Regions endpoint
app.use('/regions', regions);
// Countries endpoint
app.use('/countries', countries);
// Cities endpoint
app.use('/cities', cities);
