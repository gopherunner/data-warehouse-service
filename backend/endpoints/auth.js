const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { getRegisteredUser, getUser } = require('../db/users');

const jwtSignature = process.env.APP_SECRET;

async function validateUser(user) {
    const validatedUser = await getRegisteredUser(user);
    if (!validatedUser) {
        return [null];
    }

    // Check if password is valid
    let passwordOk = await bcrypt.compare(
        user.password,
        validatedUser.password
    );
    if (!passwordOk) {
        console.log("Password entered is not correct");
        return [null];
    }

    // Generate the token
    const userLogged = validatedUser.email;
    const token = jwt.sign({
       userLogged
    }, jwtSignature, { expiresIn: "1h",});
    return [ userLogged, token ];
};

// Authenticate the Users token
function authenticateUser(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // Validate the token with the verify, and it will validate that the token is valid
        // and its not expired. Notice that jwt.verify is an async func
        const authenticated = jwt.verify(token, jwtSignature);
        if (authenticated) {
            req.user = authenticated;
            // Ensure that the execution stops after triggering the callback
            return next();  
        } else {
            console.log("[DEBUG] - Error while trying to authenticate the Users token");
        }
    } catch (err) {
        res.status(403).send(`Error while validating User: ${err.message}`);
    }
};

// Check that the user has admin privileges
async function isAdmin(req, res, next) {
    const { userLogged } = req.user;
    const { is_admin } = await getUser(userLogged);
    if (is_admin) {
        return next();
    } else {
        res.status(403).json({ msg: "You don't have Admin permissions" });
        return false;
    }
};

module.exports = { validateUser, authenticateUser, isAdmin };


