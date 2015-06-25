helpers = {}

helpers.respondWithError = function(err, res) {
    console.log(err);
    res.status(500).send({"error": "Oops, something went wrong."});
}

module.exports = helpers;