var mongoose = require('mongoose');
var UserController = {}
var respondWithError = require('../utils/helpers').respondWithError;

var convertToReadableFormat = function(timeout) {
    if (timeout == 0) return 0;
    seconds = parseInt(timeout % 60);
    minutes = parseInt(timeout / 60);
    time = minutes == 0 ? String(seconds) + " seconds" : String(minutes) + " minutes and " + String(seconds) + " seconds";
    return time;
}

UserController.getPuzzleStatus = function(req, res) {
    mongoose.model('User').findById(req.user._id, function(err, user){
        if (err) {
            respondWithError(err, res);
        } else if (!user) {
            res.status(404).send({'error': 'This user does not exist.'});
        } else {
            user.getPuzzleParts(function(err, puzzleParts){
                if (err) {
                    respondWithError(err, res);
                } else if (puzzleParts.length != 0){
                    puzzleParts[puzzleParts.length-1].getTimeout(function(err, timeout){
                        if (err) {
                            respondWithError(err, res);
                        } else {
                            puzzleParts[puzzleParts.length-1].timeout = convertToReadableFormat(timeout);
                            res.render('main', { puzzleParts: puzzleParts,
                                                 currentUser: req.user.githubUsername,
                                                 done: req.user.completionTime,
                                                 firstFifty: user.isFirstFifty });
                        }
                    });
                } else {
                    res.render('main', { puzzleParts: [],
                                         currentUser: req.user.githubUsername,
                                         done: false });
                }
            });
        }
    });
}

//////////////////////////////////////////
// Below here only accessible by admins //
//////////////////////////////////////////

UserController.getUserInfo = function(req, res) {
    mongoose.model('User').findOne({ 'githubUsername': req.params.githubUsername}, function(err, user){
        if (err){
            res.status(500).send(err);
        } else if (!user){
            res.status(404).send({"error": "User not found."})
        } else {
            user.getPuzzleParts(function(err, puzzleParts){
                if (err){
                    res.status(500).send(err);
                } else {
                    user.getSubmissionLogs(function(err, logs){
                        if (err){
                            res.status(500).send(err);
                        } else {
                            res.status(200).render("user", { user: user, 
                                                             puzzleParts: puzzleParts,
                                                             logs: logs });
                        }
                    });
                }
            });
        }
    });
}

UserController.flagUser = function(req, res) {
    mongoose.model('User').findOne({ 'githubUsername': req.params.githubUsername }, function(err, user){
        if (err){
            res.status(500).send(err);
        } else if (!user){
            res.status(404).send({"error": "User not found."})
        } else {
            user.flag(function(err){
                if (err){
                    res.status(500).send(err);
                } else {
                    res.status(200).send({"message": "Successfully flagged user."});
                }
            })
        }
    });
}

module.exports = UserController;