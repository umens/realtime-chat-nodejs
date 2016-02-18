var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String
});

module.exports = mongoose.model('User', userSchema);  