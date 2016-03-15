var GoogleStrategy   = require('passport-google-oauth20').Strategy;
var User             = require('../models/user');
var config           = require('../config/config.js');

module.exports = function(passport){

    passport.use('google', new GoogleStrategy({
        clientID: config.google.app_id,
        clientSecret: config.google.app_secret,
        callbackURL: config.google.app_callback
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'google.id': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    username: 'google_' + profile.id,
                    email: profile.emails[0].value,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    picture: profile.photos[0].value,
                    google: {
                        id: profile.id
                    }
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }));
    
}