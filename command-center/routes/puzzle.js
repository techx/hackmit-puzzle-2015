var express = require('express');
var router = express.Router();
var puzzleController = require('../controllers/puzzle-controller');

var isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}

router.post('/', isAuthenticated, puzzleController.createNew);

module.exports = router;
