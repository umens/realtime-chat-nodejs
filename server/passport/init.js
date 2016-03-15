var jwt           = require('./jwt');
var google        = require('./google');
var facebook      = require('./facebook');
var twitter       = require('./twitter');
var User          = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){

    passport.use(new LocalStrategy(User.authenticate()));
    //passport.serializeUser(User.serializeUser());
    //passport.deserializeUser(User.deserializeUser());
    passport.serializeUser(function(user, done) {
	  	done(null, user);
	});

	passport.deserializeUser(function(id, done) {
	  	User.findById(id, function (err, user) {
	    	done(err, user);
	  	});
	});

    // Setting up Passport Strategies for Login and SignUp/Registration
    jwt(passport);
    google(passport);
    facebook(passport);
    twitter(passport);
}