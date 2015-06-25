var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config');

var isAdmin = function(githubUsername) {
    return config.admins.indexOf(githubUsername) != -1;
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: config.publicHostUrl + "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        mongoose.model('User')
            .findOrCreate({ githubUsername: profile.username, githubEmail: profile.emails[0].value, isAdmin: isAdmin(profile.username)}, function (err, user) {
                return done(err, user);
            });
    }
));

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/');
        }
    );

router.post('/logout', function(req, res){
    req.session.destroy();
    res.status(200).send({"message": "Logout successful"});
});

module.exports = router;
