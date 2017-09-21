'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/talkeat', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Mongo conection OK");

        app.listen(port, function () {
            console.log("API listen at http://localhost:" + port);
        });
    }
});
