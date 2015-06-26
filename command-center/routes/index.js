var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller');
/* GET home page. */
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        userController.getPuzzleStatus(req, res);
    } else {
         res.render('index', { title: "HackMIT Command Center" });
    }
});

module.exports = router;
