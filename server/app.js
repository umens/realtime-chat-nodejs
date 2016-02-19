//dependencies
var express          = require('express');
var app              = express();
//var server         = require('http').Server(app);
var io               = require('socket.io');
var fs               = require('fs');
var ent              = require('ent');
var mongoose         = require('mongoose');
var path             = require('path');
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var session          = require('express-session');
var passport         = require('passport');
var flash            = require('connect-flash');
var MongoStore       = require('connect-mongo')(session);
var passportSocketIo = require("passport.socketio");

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
var Message = require('./models/message.js');
//--connection
mongoose.connect(dbConfig.url, function(err) {
  	if (err) {
    	console.log("Could not connect to database");
    	throw err;
  	}
});
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
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
  store: sessionStore,
  secret: config.sessionSecret,
  cookie : { httpOnly: true, maxAge: 60000 } // configure when sessions expires
};
io.use(passportSocketIo.authorize({
	cookieParser: cookieParser,       // the same middleware you registrer in express
	key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id
	secret:       config.sessionSecret,   // the session_secret to parse the cookie
	store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
	success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
	fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));
app.use(session(sessionOpts))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//-- Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use(function(req, res, next) {
  	res.locals.user = req.user;
  	next();
});

//routing
//--imports
var routes = require('./routes/index')(passport);
var users = require('./routes/users');
//--usage
app.use('/', routes);

//socket
require('./sockets/base')(io);

function onAuthorizeSuccess(data, accept){
	console.log('successful connection to socket.io');
	accept();
}

function onAuthorizeFail(data, message, error, accept){
	if(error)
		throw new Error(message);
	console.log('failed connection to socket.io:', message);
	// If you use socket.io@1.X the callback looks different
	// If you don't want to accept the connection
	if(error)
		accept(new Error(message));
	// this error will be sent to the user as a special error-package
	// see: http://socket.io/docs/client-api/#socket > error-object
}

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
    res.status(err.status || 500);
    res.send('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;