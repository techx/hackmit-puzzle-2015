var express = require('express');
var router = express.Router();

var validator = require('../lib/validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET secret code. */
router.get('/secret/:password', function(req, res, next) {
  if (validator.validate(req.params.password)) {
    // res.render('secret', { secret: 'such code' } // very insecure
    var code = process.env.SECRET_CODE;
    res.render('secret', { secret: code });
  } else {
    res.render('wrong');
  }
});

module.exports = router;
