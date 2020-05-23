'use strict';
const hyperledger = require("./hyperledger");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.post('/registerOrder', (req, res) => {
    const order = req.body.order;
    hyperledger.registerOrder(order).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json(result.payload);
        }
    });
});

app.post('/queryOrderByUser', (req, res) => {
    const userID = req.body.userID;
    hyperledger.queryOrderByUser(userID).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json(result.payload);
        }
    });
    //
    // setTimeout(() => {
    //     res.status(400).json({orderList: []})
    // }, 3000);
});

app.listen(3098, () => {
    console.log('Express running on port 3098!')
});
