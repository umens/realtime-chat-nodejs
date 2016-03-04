var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
	email: String,
	firstname: String,
	lastname: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);  