var TwitterStrategy  = require('passport-twitter').Strategy;
var User             = require('../models/user');
var config           = require('../config/config.js');

module.exports = function(passport){

    passport.use('twitter', new TwitterStrategy({
        consumerKey: config.twitter.app_id,
        consumerSecret: config.twitter.app_secret,
        callbackURL: config.twitter.app_callback

    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'twitter.id': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                var names = profile.displayName.split(" ");
                user = new User({
                    username: profile.username,
                    //email: profile.emails[0].value,
                    firstname: names[0],
                    lastname: names[1],
                    picture: profile.photos[0].value,
                    twitter: {
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