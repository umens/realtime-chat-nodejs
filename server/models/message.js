var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var messageSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);;