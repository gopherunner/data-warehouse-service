const User = require('../models/users');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function getRegisteredUser(obj) {
    const { email } = obj;

    console.log("[DEBUG] => Email: " + email);

    // Search for all the users
    let users = await User.find();

    if (email) {
        const userByEmail = users.find(user => user.email === email);
        if (userByEmail != undefined) {
            return userByEmail;
        }
    }
    return null;
}

async function getUsers(id) {
    let users = await User.find({
        _id: {
            $ne: id
        }
    },
    {
        __v:0,
        password:0,
        date:0
    });

    return users;
};

async function getUserByEmail(id) {
    return await User.find( { email: id });
}

async function checkAdminUser(email) {
    try {
        const userProfile = await User.find( {email: email})
        const profile = userProfile[0].profile;
        console.log("[DEBUG] User Profile: " + profile);

        if (profile == 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) { 
        console.log("[ERROR] While trying to find the email address");
    }
};

async function checkUserEmailExists(email) {
    try {
        let emailExists = await User.findOne({ email });
        if (emailExists) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }  
}

async function createUser(usr) {
    let users = await User.find();
    console.log("[DEBUG] Users found: " + users.length);
    const findByEmail = users.find(user => user.email === usr.email);

    if (findByEmail == undefined) {
        if (usr.password) {
            const salt = await bcrypt.genSalt(5);
            usr.password = await bcrypt.hash(usr.password, salt);

            const newUser =  new User({
                firstname: usr.name,
                lastname: usr.lastname,
                email: usr.email,
                profile: usr.profile,
                password: usr.password
            });

            try {
                const userCreated = await newUser.save();
                if (userCreated) {
                    return userCreated;
                } else {
                    console.log("[ERROR] While trying to Store the new User");
                }
            } catch (error) {
                console.log("[ERROR] While trying to store the new User, error msg: " + error.message);
            }
        }
    } else {
        console.log("[ERROR] We found a user with that email address!");
    }
};

async function updateUser(user, id) {
    try {
        let userToBeUpdated = {
            firstname: user.name,
            lastname: user.lastname,
            email: user.email,
            profile: user.profile
        };

        console.table(userToBeUpdated);

        let userUpdated = await User.findByIdAndUpdate(id, userToBeUpdated);
        if (userUpdated) {
            return userUpdated;
        } else {
            console.log("[ERROR] While trying to Update the User");
        }
    } catch (error) {
        console.log("[ERROR] Cant find User with Id: " + id + ", error msg: " + error.message);
    }
};

async function deleteUser(id) {
    try {
        let userDeleted = await User.findByIdAndDelete(id);
        if (userDeleted) {
            console.log("[INFO] User ID: " + id + "successfully deleted!");
            return userDeleted;
        } else {
            console.log("[ERROR] While trying to Delete the User ID: " + id);
        }
    } catch (error) {
        console.log("[ERROR] Cant find User with Id: " + id + ", error msg: " + error.message);
    }
};

module.exports = { createUser, getRegisteredUser, updateUser, getUsers, getUserByEmail, checkUserEmailExists, checkAdminUser, deleteUser };
