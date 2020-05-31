'use strict';
const hyperledger = require("./hyperledger");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportStrategy = require("./passportStrategy").strategy;
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel");
const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
passport.use(passportStrategy);

// Authorization endpoints
/**
 * Authenticate a user with a given username and password.
 * Return an Authentication JSON-Web-Token if the login succeeds.
 */
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    try {
        if (!username || !password) {
            throw new Error('Missing fields')
        }
        const user = userModel.getUserByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = userModel.checkPassword(user.username, req.body.password);
        if (isMatch) {
            return res.status(200).send({token: createToken(user), ID: user.ID});
        } else {
            throw new Error(`Incorrect password`);
        }
        throw new Error(`Error while login as user: ${user.username}`);
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 * This function's main purpose is to check whether an auth_token is still valid or not.
 */
app.post('/checkToken', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.status(200).send({message: 'OK'});
});

function createToken(user) {
    return jwt.sign(
        {username: user.username, password: user.password}, process.env.JWT_SECRET, {expiresIn: 86400});
}

// Hyperledger endpoints
/**
 * Receive an order and try to register it into the ledger.
 * Returns all the order info if it succeeds.
 */
app.post('/registerOrder', passport.authenticate('jwt', {session: false}), (req, res) => {
    const order = req.body.order;
    const userID = req.body.userID;
    hyperledger.registerOrder(order, userID).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json({order: result.payload});
        }
    });
});

/**
 * Given a buyerID, returns a list of orders with that buyerID from the ledger.
 */
app.post('/queryOrderByBuyerID', passport.authenticate('jwt', {session: false}), (req, res) => {
    const userID = req.body.userID;
    hyperledger.queryOrderByUser(userID).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json({orderList: result.payload});
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Express running on port ${process.env.PORT}!`);
});
