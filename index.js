'use strict'

var moongose = require('mongoose');
var app = require('./app');
var port = process.env.PORT  || 3977;

moongose.connect('mongodb://localhost:27017/talkeat', (err, res) => {
    if (err){
        throw err;
    }
    else{
        console.log("MongoDB OK");
        app.listen(port, function () {
            console.log("Server listen at "+port);
        });
    }
});

