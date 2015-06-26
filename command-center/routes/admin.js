var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller');

var isAdmin = function(req, res, next){
    if (req.isAuthenticated() && req.user.isAdmin){
        return next();
    } else {
        res.redirect('/');
    }
}

/* Get a user & his/her info */
router.get('/user/:githubUsername', isAdmin, userController.getUserInfo);

router.post('/user/:githubUsername', isAdmin, userController.flagUser);

module.exports = router;
