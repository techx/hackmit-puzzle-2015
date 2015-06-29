var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var routes = require('./routes/index');
var puzzle = require('./routes/puzzle');
var auth = require('./routes/auth');
var admin = require('./routes/admin');


var app = express();

var mongoose = require('mongoose');
db = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/command-center");

var expressSession = require('express-session');
var passport = require('passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({secret: process.env.COMMAND_CENTER_SESSION_SECRET, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

require('./models/PuzzlePart');
require('./models/Submission');
require('./models/User');

app.use('/', routes);
app.use('/puzzle', puzzle);
app.use('/auth', auth);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render('404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
