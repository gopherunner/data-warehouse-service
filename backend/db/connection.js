const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

module.exports = { db: db, dbURI: dbURI}
