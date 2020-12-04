const { Sequelize } = require('sequelize');
const { database } = require('../db/db');

const port = database.port;
const db = database.db;

const sequelize = new Sequelize(
    database.db,
    database.username,
    database.password,
    {
        host: database.host,
        port: database.port,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false
        }
    },
);

const init = async () => {
    return sequelize.authenticate();
};

const query = async (q) => {
  try {
      const [rows] = await sequelize.query(q,
          {
              raw: true,
              plain: false,
              logging: console.log
          });
      return rows;
  } catch (error) {
      return Promise.reject(error);
  }
}

module.exports = {init, query, sequelize, Sequelize, db, port};
