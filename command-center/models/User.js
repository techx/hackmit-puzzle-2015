var mongoose = require('mongoose');
var helpers = require('../utils/helpers');

var userSchema = new mongoose.Schema({
    githubUsername: { type: 'String', required: true },
    githubEmail: { type: 'String' },
    created: { type: 'Date', default: Date.now },
    isSuspicious: { type: 'Boolean', default: false },
    completionTime: { type: 'Date' }
});

userSchema.statics.findOrCreate = function(parameters, callback){
    var User = this;
    User.findOne(parameters, function(err, user){
        if (err) {
            callback(err);
        } else if (user) {
            callback(null, user);
        } else {
            User.create(parameters, function(err, user){
                helpers.returnResponse(err, user, callback);
            });
        }
    });
}

module.exports = mongoose.model('User', userSchema);

