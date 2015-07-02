var mongoose = require('mongoose');
var request = require('request');
var Submission = require('./Submission');
var Puzzles = require('../config').puzzles;
var SLACK_WEBHOOK = require('../config').slackWebhook;
var PUBLIC_HOST_URL = require('../config').publicHostUrl;

// seconds
BACKOFF_INTERVALS = [0, 30, 120, 300, 600, 1800, 3600]

// acceptable interval between guesses without penalty (ms)
INTERVAL_BETWEEN_GUESSES = 10000

var puzzlePartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    number: { type: 'Number', required: true },
    createdAt: { type: 'Date', default: Date.now },
    lastGuess: { type: 'String', default: "" },
    lastGuessTimestamp: { type: 'Date' },
    completionTimestamp: { type: 'Date' },
    timeoutLevel: { type: 'Number', min: 0, max: 5, default: 0 },
    lastTimeoutTimestamp: { type: 'Date' },
    url: { type: 'String', required: true }, //url to this part of the puzzle
    guessesBeforeBackoff: { type: 'Number', min: 0, default: 5 }
});

puzzlePartSchema.set('autoIndex', false);

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

puzzlePartSchema.statics.createPart = function(userId, githubUsername, number, callback) {
    this.create({ user: userId, number: number, url: Puzzles[number].generateUrl(githubUsername) }, callback);
}

puzzlePartSchema.method('resetTimeout', function(callback){
    this.guessesBeforeBackoff = 5;
    this.timeoutLevel = 0;
    this.save(callback);
});

puzzlePartSchema.method('getTimeout', function(callback){
    if (this.timeoutLevel == 0) {
        callback(null, 0);
    } else {
        var timeLeft = 
            BACKOFF_INTERVALS[this.timeoutLevel] - (Date.now() - this.lastTimeoutTimestamp)/1000;
        if (timeLeft < 0) {
            //reset the timeout after they wait 2x the timeout without causing another one
            var shouldResetTimeout = 
                (Date.now() - this.lastTimeoutTimestamp) > 2000 * BACKOFF_INTERVALS[this.timeoutLevel]; 
            if (shouldResetTimeout) {
                this.resetTimeout(function(err){
                    callback(err, 0);
                });
            } else {
                callback(null, 0);
            }
        } else {
            callback(null, timeLeft);
        }
    }
});

puzzlePartSchema.method('invokeTimeout', function(callback){
    //don't increase past 1 hour lol
    if (this.timeoutLevel < 6) {
        this.timeoutLevel += 1;
    }
    this.lastTimeoutTimestamp = Date.now();
    this.guessesBeforeBackoff = 5;
    this.save(callback);
});

puzzlePartSchema.method('makeGuess', function(username, guess, callback){
    if (this.completionTimestamp) {
        callback(err); // don't let them enter more guesses for completed puzzles
    }
    var that = this;
    guess = decodeURIComponent(guess).trim();
    var isCorrect = Puzzles[this.number].verifierFunction(guess, username);
    // log guesses
    Submission
        .create({ user: username, 
                  puzzleNumber: that.number, 
                  guess: guess, 
                  isCorrect: isCorrect, 
                  timestamp: Date.now() }
        , function(err){
            if (err) {
                callback(err);
            } else if (isCorrect) {
                that.completionTimestamp = Date.now();
                that.lastGuess = guess;
                that.save(function(err) {
                    if (err) {
                        callback(err);
                    } else if (that.number != Puzzles.length-1) {
                        mongoose.model('PuzzlePart')
                            .createPart(that.user, username, that.number+1, callback(err, true));
                    } else {
                        mongoose.model('User')
                            .count({ completionTime : { $ne: null } }
                            , function(err, count){
                                if (err) {
                                    callback(err);
                                } else {
                                    mongoose.model('User')
                                        .findById(that.user, function(err, user){
                                            if (err) {
                                                callback(err);
                                            } else {
                                                user.completionTime = Date.now();
                                                user.isFirstFifty = count < 50;
                                                user.save(function(err) {
                                                    postCompletionToSlack(user.githubUsername, callback);
                                                });
                                            }
                                        });
                                }
                            });
                    }
                });
            } else {
                if (that.lastGuessTimestamp && Date.now() - that.lastGuessTimestamp < INTERVAL_BETWEEN_GUESSES) {
                    that.guessesBeforeBackoff -= 1;
                }
                that.lastGuessTimestamp = Date.now();
                that.lastGuess = guess;
                if (that.guessesBeforeBackoff == 0) {
                    that.invokeTimeout(callback);
                } else {
                    that.save(callback(err, false));
                }
            }
        });    
});

module.exports = mongoose.model('PuzzlePart', puzzlePartSchema);
