var express = require('express');
var router = express.Router();

var Message = require('../models/message.js');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

module.exports = function(passport){

	// /* GET login page. */
	// router.get('/login', function(req, res) {
 //    	// Display the Login page with any flash message, if any
	// 	res.render('login', { message: req.flash('message') });
	// });

	// /* Handle Login POST */
	// router.post('/login', passport.authenticate('login', {
	// 	successRedirect: '/',
	// 	failureRedirect: '/login',
	// 	failureFlash : true  
	// }));

	// /* GET Registration Page */
	// router.get('/signup', function(req, res){
	// 	res.render('register',{message: req.flash('message')});
	// });

	/* Handle Registration POST */
	// router.post('/signup', passport.authenticate('signup', {
	// 	successRedirect: '/',
	// 	failureRedirect: '/signup',
	// 	failureFlash : true  
	// }));
	router.post('/signup', function (req, res) {
		console.log(req.body);
		res.json({
			'msg': 'success!'
		});
	});


	/* GET Home Page */
	router.get('/', isAuthenticated, function (req, res) {
	    // Find all messages.
	    Message.find().sort( { date: -1 } ).limit( 5 ).populate('author').exec( function ( err, messages ){
	        //console.log(messages);
	        res.render('index', { 'messages': messages });
	    });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	return router;
}





