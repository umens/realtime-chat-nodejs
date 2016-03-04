//dependencies
var express      = require('express');
var app          = express();
var io           = require('socket.io');
var fs           = require('fs');
var mongoose     = require('mongoose');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var passport     = require('passport');
var MongoStore   = require('connect-mongo')(session);

var io               = io();
app.io               = io;

//configuration
//--import config files
var config   = require('./config/config.js');
var dbConfig = require('./config/database.js');

/**
 * Development Settings
 */
if (app.get('env') === 'development') {
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));
}
/**
 * Production Settings
 */
if (app.get('env') === 'production') {
    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));
}

//--database
//--models

//--connection
mongoose.connect(dbConfig.url, function(err) {
  	if (err) {
    	console.log("Could not connect to database");
    	throw err;
  	}
});
//--others
//app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.sessionSecret));
//session
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: config.sessionSecret,
  cookie : { httpOnly: true, maxAge: 60000 } // configure when sessions expires
};
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

//-- Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

//routing
//--imports
var auth = require('./routes/auth')(passport);
var routes = require('./routes/index')(passport);
var users = require('./routes/users')(passport);

//--usage
app.use('/', routes);
app.use('/auth', auth);

//socket
require('./sockets/base')(io);

//--------- ERROR Handling

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send('error', {
        message: err.message,
        error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;