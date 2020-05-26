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
app.post('/login', (req, res) => {
    console.log(req.body);
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
            return res.status(200).send({token: createToken(user)});
        } else {
            throw new Error(`Incorrect password`);
        }
        throw new Error(`Error while login as user: ${user.username}`);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post('/checkToken', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.status(200).send({message: 'OK'});
});

function createToken(user) {
    return jwt.sign(
        {username: user.username, password: user.password}, process.env.JWT_SECRET, {expiresIn: 86400});
}

// Hyperledger endpoints
app.post('/registerOrder', passport.authenticate('jwt', {session: false}), (req, res) => {
    const order = req.body.order;
    hyperledger.registerOrder(order).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json(result.payload);
        }
    });
});

app.post('/queryOrderByBuyerID', passport.authenticate('jwt', {session: false}), (req, res) => {
    const buyerID = req.body.buyerID;
    hyperledger.queryOrderByUser(buyerID).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json(result.payload);
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Express running on port ${process.env.PORT}!`);
});
