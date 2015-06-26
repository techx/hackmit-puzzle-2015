var mongoose = require('mongoose');
var Submission = require('./Submission');
var Puzzles = require('../config').puzzles;

// seconds
EXPONENTIAL_BACKOFF = [0, 30, 120, 300, 600, 1800, 3600]

var puzzlePartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    number: { type: 'Number', required: true },
    createdAt: { type: 'Date', default: Date.now },
    lastGuess: { type: 'String', default: "" },
    completionTimestamp: { type: 'Date' },
    timeoutLevel: { type: 'Number', min: 0, max: 5, default: 0 },
    lastTimeoutTimestamp: { type: 'Date' },
    url: { type: 'String', required: true }, //url to this part of the puzzle
    guessesBeforeBackoff: { type: 'Number', min: 0, default: 5 }
});

puzzlePartSchema.set('autoIndex', false);

puzzlePartSchema.statics.createPart = function(userId, number, callback) {
    this.create({ user: userId, number: number, url: Puzzles[number].url }, callback);
}

puzzlePartSchema.method('resetTimeout', function(callback){
    this.exponentialBackoff = false;
    this.guessesBeforeBackoff = 5;
    this.timeoutLevel = 0;
    this.save(callback);
});

puzzlePartSchema.method('getTimeout', function(callback){
    if (this.timeoutLevel == 0) {
        callback(null, 0);
    } else {
        var timeLeft = 
            EXPONENTIAL_BACKOFF[this.timeoutLevel] - (Date.now() - this.lastTimeoutTimestamp)/1000;
        if (timeLeft < 0) {
            //reset the timeout after they wait 2x the timeout without causing another one
            var shouldResetTimeout = 
                (Date.now() - this.lastTimeoutTimestamp) > 2000 * EXPONENTIAL_BACKOFF[this.timeoutLevel]; 
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
    var isCorrect = Puzzles[this.number].verifierFunction(guess.trim());
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
                                .createPart(that.user, that.number+1 , callback(err, true));
                    } else {
                        mongoose.model('User')
                            .count({ completionTime : { $ne: null } }, 'completionTime')
                            , function(err, count){
                                if (err) {
                                    callback(err)
                                } else {
                                    mongoose.model('User')
                                        .findById(that.user, function(err, user){
                                            user.completionTime = Date.now();
                                            user.isfirstFifty = count < 50;
                                            user.save(function(err) {
                                                callback(null, true);
                                            });
                                        });
                                }
                            }
                    }
                });
            } else {
                that.guessesBeforeBackoff -= 1;
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
