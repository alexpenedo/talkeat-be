'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'clave_secreta';

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        ext: moment().add(30, 'days').unix()
    };
    return jwt.encode(payload, secret);
};