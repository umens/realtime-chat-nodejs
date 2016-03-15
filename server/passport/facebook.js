var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../models/user');
var config           = require('../config/config.js');

module.exports = function(passport){

    passport.use('facebook', new FacebookStrategy({
        clientID: config.facebook.app_id,
        clientSecret: config.facebook.app_secret,
        callbackURL: config.facebook.app_callback,
        profileFields: ["id","first_name","emails", "last_name", "picture.width(200).height(200)"]
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            "facebook.id": profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    username: 'facebook_' + profile.id,
                    email: profile.emails[0].value,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    picture: profile.photos[0].value,
                    facebook: {
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