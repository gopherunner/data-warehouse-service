const { User } = require('../models/users');
const { Sequelize } = require('./connection');
const bcrypt = require('bcrypt');

const Op = Sequelize.Op;

async function getRegisteredUser(obj) {
    const { email } = obj;

    if (email) {
        let userFound = await User.findOne({
            where: {
                email: email,
            },
        });
        return userFound;
    }
    return null;
}

async function getUsers() {
    await User.findAll()
        .then(user => {
            return res.status(200).json({ users: user });
        })
        .catch(err => {
            return res.status(404).json({ msg: 'ERROR While trying to get Customers from the API', error: err });
        })
};

async function getUser(email) {
    const userFound = await User.findOne({
        where: {
            email: email
        },
        raw: true
    });
    return userFound;
}

async function checkUserEmailExists(email) {
    try {
        let emailExists = await User.findOne({
            where: {
                email: email,
            },
        });
        if (emailExists) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }  
}

async function createUser(obj) {
    // Check if email is already registered
    let userEmailExists = await checkUserEmailExists(obj.email);
    if (userEmailExists) {
        return false;
    }

    console.log("User email exists?: " + userEmailExists);
    // Hash the User password
    const salt = await bcrypt.genSalt(5);
    obj.password = await bcrypt.hash(obj.password, salt);

    const userCreated = await User.create(obj);
    if (userCreated) {
        return userCreated.user_id;
    } else {
        return false;
    }
}

async function updateUser(obj, id) {
    const updatedUser = await User.update(obj, {
        where: {
            user_id: id,
        },
    });
    return updatedUser[0];
}

module.exports = { createUser, getRegisteredUser, updateUser, getUsers, getUser, checkUserEmailExists };
