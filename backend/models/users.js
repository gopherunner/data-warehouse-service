const Sequelize = require('sequelize');
const db = require('../db/connection');

const User = db.sequelize.define('users', {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The first name can't be empty",
                },
            },
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The last name can't be empty",
                },
            },
        },
        email: {
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
        is_admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The password can't be empty",
                },
            },
        },
    },
);

module.exports = { Sequelize, User };
