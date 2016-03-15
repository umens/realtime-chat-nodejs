var Message     = require('../models/message.js');
var config      = require('../config/config.js');
var ent         = require('ent');
var socketioJwt = require("socketio-jwt");

module.exports = function(io){

    io.use(socketioJwt.authorize({
        secret: config.sessionSecret,
        handshake: true
    }));
    var online_users = [];
    var username;

    io.on('connection', function (socket) {

        socket.emit('on_connect', online_users);

        if(socket.decoded_token.username !== undefined){
            username = socket.decoded_token.username;
        }
        else{
            username = socket.decoded_token.firstname + ' ' + socket.decoded_token.lastname;
        }

        // Dès qu'on nous donne un pseudo, on le stocke en variable de session
        socket.on('nouveau_client', function() {
            online_users.push(username);
            //socket.user = socket.decoded_token.username;
            socket.broadcast.emit('client_connected', username);
        });

        // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
        socket.on('message', function (message) {
            message.message = ent.encode(message.message);
            socket.broadcast.emit('message', message);
            var db_message = new Message({ 'author': message.author._id, 'message': message.message, 'date': message.date });
            db_message.save(function(err) {
              if (err) throw err;

              //console.log('Message saved successfully!');
            });
        }); 

        socket.on('disconnect', function () {        
            var index = online_users.indexOf(username);
            if (index > -1) {
                online_users.splice(index, 1);
            }
            socket.broadcast.emit('client_disconnect', username);
        }); 


        socket.on("typing", function(data) {
            socket.broadcast.emit("isTyping", {isTyping: data, person: username});
        });
    });
};