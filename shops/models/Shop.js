const mongoose = require('mongoose');

module.exports = mongoose.model('Shop', {
    tradename: String,
    businessName: String,
    address: String,
    district: String,
    shopCategoryId: Number,
    contactPerson: String,
    contactPhone: Number,
    logoUrl: String,
    lat: Number,
    lon: Number,
    products: [],
    rating: [],
    nowOpen: Boolean
}, 'shops');