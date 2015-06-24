var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET){
    throw "You are missing env variables for Github."
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.PUBLIC_HOST_URL + "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        mongoose.model('User').findOrCreate({ githubUsername: profile.username, githubEmail: profile.emails[0].value }, function (err, user) {
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
