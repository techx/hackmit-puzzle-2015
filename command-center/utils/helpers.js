helpers = {}

helpers.returnResponse = function(err, successResponse, callback) {
    if (err) {
        callback(err);
    } else {
        callback(null, successResponse);
    }
}

module.exports = helpers;