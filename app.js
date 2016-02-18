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
//--Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
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
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));
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
var routes = require('./routes/index')(passport);;
//var users = require('./routes/users');
//--usage
app.use('/', routes);
//app.use('/user/', users);


//socket
// Fonction du socket
io.on('connection', function (socket) {

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('nouveau_client', function() {
        // pseudo = ent.encode(pseudo);
        // socket.pseudo = pseudo;
        socket.broadcast.emit('client_connected', socket.request.user.username);
    });

    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {'pseudo': socket.request.user.username, 'message': message});
        var db_message = new Message({ 'author': socket.request.user._id, 'message': message });
        db_message.save(function(err) {
          if (err) throw err;

          console.log('Message saved successfully!');
        });
    }); 

    socket.on('disconnect', function () {        
        socket.broadcast.emit('client_disconnect', socket.request.user.username);
    }); 


    socket.on("typing", function(data) {  
        if (typeof socket.request.user.username !== "undefined")
            socket.broadcast.emit("isTyping", {isTyping: data, person: socket.request.user.username});
    });
});

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