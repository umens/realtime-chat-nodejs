var express = require('express');
var router  = express.Router();
var ent     = require('ent');
var Message = require('../models/message.js');

module.exports = function(passport){

	/* GET Home Page */
	router.get('/messages', passport.authenticate('jwt', { session: false}), function (req, res) {
	    // Find all messages.
	    Message.find().sort( { date: -1 } ).limit( 5 ).populate('author').exec( function ( err, messages ){
	    	messages.forEach(function(entry) {
			    entry.message = ent.decode(entry.message);
			});
    		res.json({ messages: messages.reverse() });
	    });
	});

	return router;
}





