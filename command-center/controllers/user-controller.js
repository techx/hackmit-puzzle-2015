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
            res.status(404).send({ "error": "This user does not exist." });
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
                                                 currentUser: user.githubUsername,
                                                 userEmail: user.githubEmail,
                                                 done: user.completionTime });
                        }
                    });
                } else {
                    res.render('main', { puzzleParts: [],
                                         currentUser: user.githubUsername,
                                         done: false });
                }
            });
        }
    });
}

UserController.updateEmail = function(req, res) {
    if (!req.query.email) {
        res.status(400).send({"error": "Email cannot be empty."});
    } else {
        mongoose.model('User').findById(req.user._id, function(err, user){
            if (err) {
                respondWithError(err, res);
            } else if (!user) {
                res.status(404).send({ "error": "This user does not exist." });
            } else {
                user.githubEmail = req.query.email;
                user.save(function(err){
                    if (err) {
                        respondWithError(err, res);
                    } else {
                        res.status(200).send({ "message": "Update successful." });
                    }
                });
            }
        });
    }
}

//////////////////////////////////////////
// Below here only accessible by admins //
//////////////////////////////////////////

UserController.getUserInfo = function(req, res) {
    mongoose.model('User').findOne({ "githubUsername": req.params.githubUsername}, function(err, user){
        if (err){
            res.status(500).send(err);
        } else if (!user){
            res.status(404).send({ "error": "User not found." });
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
    mongoose.model('User').findOne({ "githubUsername": req.params.githubUsername }, function(err, user){
        if (err){
            res.status(500).send(err);
        } else if (!user){
            res.status(404).send({ "error": "User not found." });
        } else {
            if (req.query.flag == "y") {
                user.flag(req.query.reason, req.user.githubUsername, function(err){
                    if (err){
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({ "message": "Successfully flagged user." });
                    }
                });
            } else {
                user.unflag(function(err){
                    if (err){
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({ "message": "Successfully flagged user." });
                    }
                });
            }
        }
    });
}

UserController.getAllUsers = function(req, res) {
    mongoose.model('User').find({ "completionTime": { $ne: null }}, "githubUsername completionTime isSuspicious created")
        .sort({ "completionTime": 1 })
        .exec(function(err, completedUsers) {
            if (err) {
                res.status(500).send(err);
            } else {
                mongoose.model('User').find({ "completionTime": null}, "githubUsername completionTime isSuspicious")
                .exec(function(err, otherUsers) {
                    if (err){
                        res.status(500).send(err);
                    } else {
                        var users = completedUsers.concat(otherUsers);
                        res.status(200).render("userList", { users: users });
                    }
                });
            }
    });
}

module.exports = UserController;