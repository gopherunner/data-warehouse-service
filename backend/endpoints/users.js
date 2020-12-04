const { Router } = require('express');
const userRouter = Router();
const { createUser, getUsers, updateUser } = require('../db/users');
const { validateUser, isAdmin, authenticateUser } = require('./auth');

// User login endpoint
userRouter.post('/login', async (req, res) => {
    const userLogin = req.body;
    [ userLogged, token ] = await validateUser(userLogin);
    if (!userLogin) {
        res.status(400).json({ msg: "Email and/or password wrong!" });
        return;
    }
    console.log('[INFO] Logged In successfully from user (' + (userLogin.email) + ') with Token: ' + token);
    res.status(200).json({ msg: 'Logged in successfully', token: token });
});

// User register endpoint
userRouter.post('/register', async (req, res) => {
    const newUser = req.body;
    // console.log('New User email: ' + req.body.email);
    try {
        const created = await createUser(newUser);

        if (created) {
            res.status(201).json({ msg: "User created successfully. The User email is", data: newUser.email });
        } else {
            res.status(401).json({ msg: "User already registered", data: newUser.email });
        }
    } catch (error) {
        res.status(400).json({ msg: "Error ocurred", data: error.message });
    }
});

// User orders endpoint
// userRouter.get('/orders', authenticateCustomer, async (req, res) => {
//     const cust = req.customer.customerLogged;
//     const ordersFound = await getCustomerOrders(cust);
//     if (ordersFound.length != 0) {
//         res.status(200).json({ orders: ordersFound });
//     } else {
//         res.status(400).json({ msg: 'There are no available orders!' });
//     }
// });

userRouter.put('/:id', authenticateUser, isAdmin, async (req, res) => {
    const userId = req.params.id;
    const changes = req.body;
    const updated = await updateUser(changes, userId);
    if (updated == 1) {
        res.status(201).json({ msg: `User with ID: ${userId} successfully updated!` });
    } else {
        res.status(400).json({ msg: `There was a problem when trying to update User with ID: ${userId}` });
    }
});

userRouter.get('/', async (req, res) => {
    try {
        const users = await getUsers();

        if (users) {
            res.status(201).json({ msg: "Users retrieved successfully", data: users });
        } else {
            res.status(401).json({ msg: "There was an error while trying to retrieve the Users" });
        }
    } catch (error) {
        res.status(400).json({ msg: "Error ocurred", data: error.message });
    } 
});

module.exports = userRouter;
