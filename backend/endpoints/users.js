const { Router } = require('express');
const userRouter = Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../db/users');
const { validateUser, isAdmin, authenticateUser } = require('./auth');

// User login endpoint
userRouter.post('/login', async (req, res) => {
    const userLogin = req.body;
    [ userLogged, token, profile ] = await validateUser(userLogin);
    if (!userLogged) {
        res.status(400).jsonp({ msg: "Email and/or password wrong!" });
        return;
    }
    console.log('[INFO] Logged In successfully from user (' + (userLogin.email) + ') with Token: ' + token + ' and profile: ' + profile);
    res.status(200).jsonp({ msg: 'Logged in successfully', token: token, profile: profile });
});

// User register endpoint
userRouter.post('/register', async (req, res) => {
    const user = req.body;
    try {
        const userCreated = await createUser(user);

        if (userCreated) {
            res.status(201).jsonp({ msg: "User created successfully. The User email is", data: user.email });
        } else {
            res.status(401).jsonp({ msg: "User already registered", data: user.email });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: "Error ocurred", data: error.message });
    }
});

userRouter.put('/:_id', async (req, res) => {
    const userId = req.params;
    const changes = req.body;
    const updated = await updateUser(changes, userId);
    if (updated == 1) {
        res.status(201).jsonp({ msg: `User with ID: ${userId} successfully updated!` });
    } else {
        res.status(400).jsonp({ msg: `There was a problem when trying to update User with ID: ${userId}` });
    }
});

userRouter.get('/', async (req, res) => {
    try {
        const users = await getUsers();

        if (users) {
            res.status(201).jsonp({ data: users });
        } else {
            res.status(401).jsonp({ msg: "There was an error while trying to retrieve the Users" });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: "Error ocurred", data: error.message });
    } 
});

userRouter.delete('/:_id', async (req, res) => {
    const userId = req.params;
    const userDeleted = await deleteUser(userId);
    if (userDeleted) {
        res.status(201).jsonp({ msg: `User with ID: ${userId} successfully deleted!` });
    } else {
        res.status(400).jsonp({ msg: `There was a problem when trying to delete User with ID: ${userId}` });
    }
});

module.exports = userRouter;
