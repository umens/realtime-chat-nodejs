var express = require('express');
var router  = express.Router();
var jwt     = require('jwt-simple');
var User    = require('../models/user');
var config  = require('../config/config.js');

module.exports = function(passport, session){

	router.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				
				return res.status(401).json({success: false, err: info});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({success: false, err: 'Could not log in user : '+err});
				}
				var token = jwt.encode(user, config.sessionSecret);
				res.status(200).json({success: true, token: 'JWT ' + token, user: user, status: 'Login successful!'});
			});
		})(req, res, next);
	});

	router.post('/signup', function (req, res, next) {
		var newUser = new User();
		newUser.firstname = req.body.firstname;
		newUser.lastname = req.body.lastname;
		newUser.email = req.body.email;
		newUser.username = req.body.username;
		User.register(newUser, req.body.password, function(err) {
		    if (err) {
		    	return res.status(500).json({success: false, msg: err});
		    }

		    return res.status(200).json({success: true, status: 'Registration successful!'});
	  	});
	});

	router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));

  	router.get('/facebook/callback', function(req, res, next) {
		passport.authenticate('facebook', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				return res.status(401).json({success: false, err: info});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({success: false, err: 'Could not log in user : '+err});
				}
				var token = jwt.encode(user, config.sessionSecret);
				//res.status(200).json({success: true, token: 'JWT ' + token, user: user, status: 'Login successful!'});
				res.writeHead(302, {
                	'Location': '/#/oauth?token=' + encodeURIComponent('JWT ' + token) + '&username=' + encodeURIComponent(user.firstname + ' ' + user.lastname) + '&picture=' + encodeURIComponent(user.picture) + '&id=' + encodeURIComponent(user._id)
	            });
	            res.end();
			});
		})(req, res, next);
	});

	router.get('/twitter', passport.authenticate('twitter'));

	router.get('/twitter/callback', function(req, res, next) {
		passport.authenticate('twitter', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				return res.status(401).json({success: false, err: info});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({success: false, err: 'Could not log in user : '+err});
				}
				var token = jwt.encode(user, config.sessionSecret);
				//res.status(200).json({success: true, token: 'JWT ' + token, user: user, status: 'Login successful!'});
				res.writeHead(302, {
                	'Location': '/#/oauth?token=' + encodeURIComponent('JWT ' + token) + '&username=' + encodeURIComponent(user.username) + '&picture=' + encodeURIComponent(user.picture) + '&id=' + encodeURIComponent(user._id)
	            });
	            res.end();
			});
		})(req, res, next);
	});

	router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

	router.get('/google/callback', function(req, res, next) {
		passport.authenticate('google', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				return res.status(401).json({success: false, err: info});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({success: false, err: 'Could not log in user : '+err});
				}
				var token = jwt.encode(user, config.sessionSecret);
				//res.status(200).json({success: true, token: 'JWT ' + token, user: user, status: 'Login successful!'});
				res.writeHead(302, {
                	'Location': '/#/oauth?token=' + encodeURIComponent('JWT ' + token) + '&username=' + encodeURIComponent(user.firstname + ' ' + user.lastname) + '&picture=' + encodeURIComponent(user.picture) + '&id=' + encodeURIComponent(user._id)
	            });
	            res.end();
			});
		})(req, res, next);
	});

	router.get('/logout', function(req, res) {
		req.logout();
		res.status(200).json({status: 'Bye!'});
	});

	return router;
}





