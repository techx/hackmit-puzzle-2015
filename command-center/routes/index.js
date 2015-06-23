var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('main', { currentUser: req.user.githubUsername });
  } else {
     res.render('index', { title: 'HackMIT Command Center' });
  }
});

module.exports = router;
