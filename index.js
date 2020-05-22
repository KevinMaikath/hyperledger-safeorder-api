'use strict';
const hyperledger = require("./hyperledger");

const express = require("express");
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/registerOrder', (req, res) => {
    // const cart = {
    //     ID: '12345',
    //     shopID: '44444',
    //     buyerID: '11111',
    //     date: new Date().toUTCString(),
    //     items: [
    //         {ID: 'IDarticulo', name: 'art_1', price: 10, quantity: 1},
    //         {ID: 'IDarticulo22', name: 'art_2', price: 10, quantity: 2},
    //         {ID: 'IDarticulo33', name: 'art_3', price: 10, quantity: 3},
    //     ]
    // };
    const cart = req.params.order;
    hyperledger.registerOrder(cart).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
        } else {
            res.status(200).json(result.payload);
        }
    })
});

app.listen(3000, () => {
    console.log('Express running on port 3000!')
});
