'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    postalCode: String,
    address: String,
    country: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

