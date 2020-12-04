require('dotenv').config();

const config = {
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        db: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS
    }
};

module.exports = config;
