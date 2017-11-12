'use strict'

function errorResponse(res, err, object) {
    var message = {message: 'Error en la operación'};
    var errorFound = false;
    if (err) {
        res.status(500).send(message);
        errorFound = true;
    }
    else {
        if (!object) {
            res.status(404).send(message);
            errorFound = true;
        }
    }
    return errorFound;
}

module.exports = {
    errorResponse
}