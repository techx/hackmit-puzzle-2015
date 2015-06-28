var mongoose = require('mongoose');
var PuzzleController = {}
var respondWithError = require('../utils/helpers').respondWithError;

PuzzleController.createNew = function(req, res){
    mongoose.model('PuzzlePart').count({ user: req.user._id }, function(err, count){
        if (err){
            respondWithError(err, res);
        } else if (count != 0){
            res.status(200).send({});
        } else {
            mongoose.model('PuzzlePart').createPart(req.user._id, req.user.githubUsername, 0, function(err, puzzlePart){
                if (err){
                    respondWithError(err, res);
                } else {
                    res.status(201).send({});
                }
            });
        }
    });
}

PuzzleController.makeGuess = function(req, res){
    mongoose.model('PuzzlePart').findOne({ user: req.user._id, number: req.query.puzzleNumber }
        , function(err, puzzlePart){
            if (err){
                respondWithError(err, res);
            } else if (!puzzlePart) {
                res.status(404).send({ "error": "Could not find this puzzle part." });
            } else {
                puzzlePart.getTimeout(function(err, timeout){
                    if (err){
                        respondWithError(err, res);
                    } else if (timeout != 0) {
                        res.status(400).send({ "error": "Please wait "+ timeout + "before guessing again." })
                    } else if (puzzlePart.completionTimestamp) {
                        res.status(400).send({ "error": "You already finished this part of the puzzle." });
                    } else {
                        puzzlePart.makeGuess(req.user.githubUsername, req.query.guess, function(err, correct){
                            if (err){
                                respondWithError(err, res);
                            } else {
                                res.status(200).send({ "correct": correct });
                            }
                        });    
                    }
                });
            }
        }
    );
}

module.exports = PuzzleController;