var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    githubUsername: { type: 'String', required: true, index: true },
    githubEmail: { type: 'String' },
    isAdmin: { type: 'Boolean' },
    created: { type: 'Date', default: Date.now },
    isSuspicious: { type: 'Boolean', default: false },
    completionTime: { type: 'Date' },
    isFirstFifty: { type: 'Boolean' }
});

userSchema.set('autoIndex', false);

userSchema.statics.findOrCreate = function(parameters, callback){
    mongoose.model('User').findOne(parameters, function(err, user){
        if (err) {
            callback(err);
        } else if (user) {
            callback(null, user);
        } else {
            mongoose.model('User').create(parameters, callback);
        }
    });
}

userSchema.method('getPuzzleParts', function(callback){
    mongoose.model('PuzzlePart').find({ 'user': this._id }).sort({ 'number': 1 }).exec(callback);
});

userSchema.method('getSubmissionLogs', function(callback){
    mongoose.model('Submission').find({ 'user': this.githubUsername }).sort({ 'timestamp': 1}).exec(callback);
});

// flag user for being suspicious
userSchema.method('flag', function(callback){
    this.isSuspicious = true;
    this.save(callback);
});

module.exports = mongoose.model('User', userSchema);
