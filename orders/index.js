const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Order = require('./models/Order');


mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const app = express();

app.use(bodyParser.json());

app.post('/orders', (req, res) => {
    const order = new Order({
        userId: req.body.userId,
        lat: req.body.lat,
        lon: req.body.lon,
        products: req.body.products,
        status: true
    });

    order.save().then((order) => {
        res.status(200).json({ status: 1, message: 'Se creó correctamente la orden', data: order });
    });
});

app.get('/orders', (req, res) => {
    Order.find({}, function (err, orders) {
        res.status(200).send({ status: 1, data: orders });
    });
});

app.get('/orders/:orderId', (req, res) => {
    Order.find({ _id: req.params.orderId }, function (err, order) {
        res.status(200).send({ status: 1, data: order });
    });
});

app.delete('/orders/:orderId', (req, res) => {
    Order.findById(req.params.orderId, function (err, order) {
        if (order != null) {
            order.status = false;
            order.save();
            res.status(200).send({ status: 1, data: null, message: 'Se canceló la orden correctamente' });
        } else {
            res.status(200).send({ status: 0, data: null, message: 'No existe ninguna orden con este id' });
        }
    });
});

app.listen(9200, () => {
    console.log('escuchando en el puerto 9200');
});