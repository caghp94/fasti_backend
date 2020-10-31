const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    phoneNumber: Number,
    name: String,
    surName: String,
    password: String
});