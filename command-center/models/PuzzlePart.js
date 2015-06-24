var mongoose = require('mongoose');
var Submission = require('./Submission');

// placeholders
ANSWERS = [1,2,3,4,5,6];

// seconds
EXPONENTIAL_BACKOFF = [0, 30, 120, 300, 600, 1800, 3600]

var puzzlePartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    number: { type: 'Number', required: true},
    lastGuess: { type: 'String', default: "" },
    completionTimestamp: { type: 'Date' },
    timeoutLevel: { type: 'Number', min: 0, max: 5, default: 0 },
    lastTimeoutTimestamp: { type: 'Date' },
    guessesBeforeBackoff : { type: 'Number', min: 0, default: 5}
});

puzzlePartSchema.method('resetTimeout', function(callback){
    this.exponentialBackoff = false;
    this.guessesBeforeBackoff = 5;
    this.timeoutLevel = 0;
    this.save(callback);
});

puzzlePartSchema.method('getTimeout', function(callback){
    var timeLeft = EXPONENTIAL_BACKOFF[this.timeoutLevel] - (Date.now() - this.lastTimeoutTimestamp)/1000;
    if (timeLeft < 0) {
        //reset the timeout after they wait 2x the timeout without causing another one
        var shouldResetTimeout = (Date.now() - this.lastTimeoutTimestamp) > 2000 * EXPONENTIAL_BACKOFF[this.timeoutLevel]; 
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

puzzlePartSchema.method('makeGuess', function(guess, callback){
    var that = this;
    var isCorrect = guess.trim() == ANSWERS[this.number];
    Submission.create({ user: that.user.githubUsername, puzzleNumber: that.number, guess: guess, isCorrect: isCorrect, timestamp: Date.now() }, function(err){
        if (err) {
            callback(err);
        } else if (isCorrect) {
            that.completionTimestamp = Date.now;
            that.save(callback);
        } else {
            that.guessesBeforeBackoff -= 1;
            if (that.guessesBeforeBackoff == 0) {
                that.invokeTimeout(callback);
            } else {
                that.save(callback);
            }
        }
    });    
});

module.exports = mongoose.model('PuzzlePart', puzzlePartSchema);
