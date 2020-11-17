const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const app = express();

app.use(bodyParser.json());

app.post('/users', [
    body('phoneNumber').isLength({ min: 9, max: 9 }),
    body('name').isString(),
    body('surname').isString(),
    body('password').isLength({ min: 6, max: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const user = new User({
        phoneNumber: req.body.phoneNumber,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password
    });
    user.save().then((user) => { return res.status(200).json({ status: 1, data: { id: user.id } }) });
});

app.post('/users/auth', (req, res) => {
    User.findOne({ phoneNumber: req.body.phoneNumber, password: req.body.password }, function (err, user) {
        if (user != null) {
            res.status(200).send({ status: 1, message: 'Login exitoso', data: user });
        } else {
            res.status(200).send({ status: 0, message: 'Verifica tu usuario o contraseña', data: null });
        }
    });
});

app.get('/users', (req, res) => {
    User.find({}, function (err, users) {
        res.status(200).send({ status: 1, data: users });
    });
});

app.get('/users/:userId', (req, res) => {
    console.log(req.params.userId);
    User.find({ _id: req.params.userId }, function (err, users) {
        res.status(200).send({ status: 1, data: users });
    });
});

app.delete('/users/:userId', (req, res) => {
    console.log('Eliminando el usuario: ' + req.params.userId);

    User.deleteOne({ _id: req.params.userId }, function (err, user) {
        res.status(200).send({ status: 1, data: null });
    });
});

app.put('/users/:userId', (req, res) => {
    console.log('Editando el usuario: ' + req.params.userId);

    User.findByIdAndUpdate(req.params.userId, { name: req.body.name, surname: req.body.surname, password: req.body.password, phoneNumber: req.body.phoneNumber }, function (err, user) {
        res.status(200).send({ status: 1, data: null });
    });
});

app.listen(9000, () => {
    console.log('escuchando en el puerto 9000');
});