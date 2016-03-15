var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
	email: String,
	firstname: String,
	lastname: String,
	facebook:{
		id: String
	},
	twitter:{
		id: String,
		access_token: String
	},
	google:{
		id: String,
		access_token: String
	},
	picture: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);  