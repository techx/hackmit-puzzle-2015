var mongoose = require('mongoose');
var PuzzlePart = require('./PuzzlePart');

var userSchema = new mongoose.Schema({
    githubUsername: { type: 'String', required: true },
    githubEmail: { type: 'String' },
    isAdmin: { type: 'Boolean' },
    created: { type: 'Date', default: Date.now },
    isSuspicious: { type: 'Boolean', default: false },
    completionTime: { type: 'Date' },
    isFirstFifty: { type: 'Boolean' }
});

userSchema.statics.findOrCreate = function(parameters, callback){
    var User = this;
    User.findOne(parameters, function(err, user){
        if (err) {
            callback(err);
        } else if (user) {
            callback(null, user);
        } else {
            User.create(parameters, callback);
        }
    });
}

userSchema.method('getPuzzleParts', function(callback){
    PuzzlePart.find({ 'user': this._id }).sort({ 'number': 1 }).exec(callback);
});

// flag user for being suspicious
userSchema.method('flag', function(callback){
    this.isSuspicious = true;
    this.save(callback);
});

module.exports = mongoose.model('User', userSchema);
