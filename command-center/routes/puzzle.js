var express = require('express');
var router = express.Router();
var puzzleController = require('../controllers/puzzle-controller');
var userController = require('../controllers/user-controller');

var isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}

router.post('/', isAuthenticated, puzzleController.createNew);

router.post('/guess', isAuthenticated, puzzleController.makeGuess);

router.post('/user', isAuthenticated, userController.updateEmail);

module.exports = router;
