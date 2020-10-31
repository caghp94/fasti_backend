const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Category = require('./models/ShopCategory');
const Shop = require('./models/Shop');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/shops', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const app = express();

app.use(bodyParser.json());

app.post('/categories', (req, res) => {
    Category.find({ name: req.body.name }, function (err, categories) {
        if (categories.length > 0) {
            console.log('existe');
            res.status(200).send({ status: 0, data: null, message: 'Esta categoría ya existe' });
        } else {
            const category = new Category({ name: req.body.name, status: true });
            category.save().then((user) => { return res.status(200).json({ status: 1, data: { id: user.id } }) });
        }
    });
});

app.get('/categories', (req, res) => {
    Category.find({}, function (err, users) {
        res.status(200).send({ status: 1, data: users });
    });
});

app.post('/shops', [
    body('contactPhone').isLength({ min: 9, max: 9 }),
], (req, res) => {
    const shop = new Shop({
        tradeName: req.body.tradeName,
        businessName: req.body.businessName,
        address: req.body.address,
        district: req.body.district,
        shopCategoryId: req.body.shopCategoryId,
        contactPerson: req.body.contactPerson,
        contactPhone: req.body.contactPhone,
        logoUrl: req.body.logoUrl,
        lat: req.body.lat,
        lon: req.body.lon,
        nowOpen: req.body.nowOpen
    });

    shop.save().then((shop) => {
        res.status(200).json({ status: 1, message: 'Se creó el comercio exitosamente', data: shop });
    });
});

app.get('/shops', (req, res) => {
    Shop.find({}, function (err, shops) {
        res.status(200).send({ status: 1, data: shops });
    });
});

app.delete('/shops/:shopId', (req, res) => {
    console.log('Eliminando el comercio: ' + req.params.shopId);

    Shop.deleteOne({ _id: req.params.shopId }, function (err, user) {
        res.status(200).send({ status: 1, data: null });
    });
});

app.put('/shops/:shopId/status', (req, res) => {
    console.log('Cambiando el estado de comercio ' + req.params.shopId + ' a ' + req.body.nowOpen);

    Shop.findByIdAndUpdate(req.params.shopId, { nowOpen: req.body.nowOpen }, function (err, shop) {
        res.status(200).send({ status: 1, message: 'Se editó el comercio exitosamente', data: null });
    });
});

app.get('/products', (req, res) => {
    Product.find({}, function (err, product) {
        res.status(200).send({ status: 1, data: product });
    });
});

app.post('/products', (req, res) => {
    Product.find({ name: req.body.name }, function (err, products) {
        if (products.length > 0) {
            console.log('existe');
            res.status(200).send({ status: 0, data: null, message: 'Este producto ya existe' });
        } else {
            const product = new Product({ name: req.body.name });
            product.save().then((user) => { return res.status(200).json({ status: 1, data: { id: product.id } }) });
        }
    });
});

app.post('/shops/:shopId/products', (req, res) => {
    Shop.findById(req.params.shopId, function (err, shop) {
        if (shop != null) {
            shop.products = shop.products.concat(req.body.products).unique();
            shop.save().then((shop) => { return res.status(200).json({ status: 1, data: shop }) });
        } else {
            res.status(200).send({ status: 0, data: null, message: 'No existe ningún comercio con este id' });
        }
    });
});

app.delete('/shops/:shopId/products', (req, res) => {
    Shop.findById(req.params.shopId, function (err, shop) {
        if (shop != null) {
            if (shop.products.length > 0) {
                for (var i = 0; i < shop.products.length; i++) {
                    if (shop.products[i] == req.body.productId) {
                        shop.products.splice(i, 1);
                        shop.save();
                    }
                }
            }
            res.status(200).send({ status: 1, message: 'Se quitó la disponibilidad del producto', data: shop });
        } else {
            res.status(200).send({ status: 0, data: null, message: 'No existe ningún comercio con este id' });
        }
    });
});

app.post('/shops/:shopId/rating', (req, res) => {
    Shop.findById(req.params.shopId, function (err, shop) {
        if (shop != null) {
            shop.rating.push({ score: req.body.score, comment: req.body.comment });
            shop.save({}, (err) => console.log(err));
            res.status(200).send({ status: 1, message: 'Se agregó correctamente el rating' });
        } else {
            res.status(200).send({ status: 0, data: null, message: 'No existe ningún comercio con este id' });
        }
    });
});

app.listen(9100, () => {
    console.log('escuchando en el puerto 9100');
});

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};