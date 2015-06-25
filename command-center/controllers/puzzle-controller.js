var mongoose = require('mongoose');
var PuzzleController = {}
var helpers = require('../utils/helpers');

PuzzleController.createNew = function(req, res){
    mongoose.model('PuzzlePart').count({user: req.user._id}, function(err, count){
        if (err){
            helpers.respondWithError(err, res);
        } else if (count != 0){
            res.status(200).send({})
        } else {
            // TODO: replace with actual first url
            mongoose.model('PuzzlePart').create({ user: req.user._id, number: 1, url: "https://www.hackmit.org" }, function(err, puzzlePart){
                if (err){
                    helpers.respondWithError(err, res);
                } else {
                    res.status(201).send({});
                }
            });
        }
    });
}

PuzzleController.makeGuess = function(req, res){
    mongoose.model('PuzzlePart').findOne({user: req.user._id, number: req.query.puzzleNumber}, function(err, puzzlePart){
        if (err){
            helpers.respondWithError(err, res);
        } else if (!puzzlePart) {
            res.status(404).send({"error": "Could not find this puzzle part."});
        } else {
            puzzlePart.makeGuess(req.query.guess, function(err, correct){
                if (err){
                    helpers.respondWithError(err, res);
                } else {
                    res.status(200).send({"correct": correct});
                }
            });
        }
    });
}

module.exports = PuzzleController;