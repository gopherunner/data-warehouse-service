const Sequelize = require('sequelize');
const db = require('../db/connection');

const Company = db.sequelize.define('companies', {
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        company_name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The company name can't be empty",
                },
            },
        },
        company_address: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The company address can't be empty",
                },
            },
        },
        company_country_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        company_city_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        company_email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Enter a valid email",
                },
            },
        },
        company_phone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
);

module.exports = { Sequelize, Company };
