var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller');
var puzzleController = require('../controllers/puzzle-controller');

var isAdmin = function(req, res, next){
    if (req.isAuthenticated() && req.user.isAdmin){
        return next();
    } else {
        res.render('404');
    }
}

router.get('/', isAdmin, puzzleController.getStats);

/* Get list of users sorted by completion time */
router.get('/users', isAdmin, userController.getAllUsers);

/* Get a user & his/her info */
router.get('/users/:githubUsername', isAdmin, userController.getUserInfo);

/* Flag a user for being sketchy */
router.post('/users/:githubUsername', isAdmin, userController.flagUser);

module.exports = router;
