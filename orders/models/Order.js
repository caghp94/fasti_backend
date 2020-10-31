const mongoose = require('mongoose');

module.exports = mongoose.model('Order', {
    userId: String,
    lat: String,
    lon: String,
    products: [],
    status: Boolean
}, 'orders');