var jwt           = require('./jwt');
var User          = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Setting up Passport Strategies for Login and SignUp/Registration
    jwt(passport);

}