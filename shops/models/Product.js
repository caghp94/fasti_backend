const mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    name: String
}, 'products');