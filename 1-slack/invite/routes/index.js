var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res) {
  res.render('index', { community: config.community });
});

router.use(express.static('public'));

router.post('/invite', function(req, res) {
  if (req.body.email) {
    request.post({
        url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
        form: {
          email: req.body.email,
          token: config.slacktoken,
          set_active: true
        }
      }, function(err, httpResponse, body) {
        // body looks like:
        //   {"ok":true}
        //       or
        //   {"ok":false,"error":"already_invited"}
        if (err) { return res.render('result', { result: "error", msg: body.error, community: config.community }); }
        body = JSON.parse(body);
        if (body.ok) {
          res.render('result', { result: "success", msg: "welcome! check your email then go to dogemit.slack.com", community: config.community })
        } else {
          res.render('result', { result: "error", msg: body.error, community: config.community })
        }
      });
  } else {
    res.status(400).send('email is required.');
  }
});

module.exports = router;
