var mongoose = require('mongoose');
var request = require('request');
var PuzzleController = {}
var respondWithError = require('../utils/helpers').respondWithError;
var SLACK_WEBHOOK = require('../config').slackWebhook;
var PUBLIC_HOST_URL = require('../config').publicHostUrl;

var postCompletionToSlack = function(username, callback){
    var options = {
      method: 'post',
      body: {"text": "<" + PUBLIC_HOST_URL +
                     "/admin/users/" + username + "|" + username + "> has solved the puzzle!",
             "channel": "#puzzle",
             "username": "Puzzle Monitor",
             "icon_emoji": ":dog:" },
      json: true,
      url: SLACK_WEBHOOK
    }
    request(options, function(err, httpResponse, body){
        callback(err, true);
    });
}

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
                        puzzlePart.makeGuess(req.user.githubUsername, req.query.guess, function(err, correct, done){
                            if (err){
                                respondWithError(err, res);
                            } else if (done) {
                                    postCompletionToSlack(req.user.githubUsername, function(err){
                                        if (err) {
                                            console.log("Something went wrong with the Slack Webhook.");
                                        } else {
                                            res.status(200).send({ "correct": correct });
                                        }
                                    });
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

//////////////// ADMIN ONLY ////////////////
PuzzleController.getStats = function(req, res) {
    mongoose.model('PuzzlePart').aggregate({
            $group : { _id : "$number" , count: { $sum: 1 }}
        },  function(err, stats){
                if (err){
                    res.status(500).send(err);
                } else {
                    res.status(200).render('admin', { "stats": stats });
                }
            });
}

module.exports = PuzzleController;