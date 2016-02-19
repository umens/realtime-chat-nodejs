var Message = require('../models/message.js');

module.exports = function(io){

    io.on('connection', function (socket) {

        // Dès qu'on nous donne un pseudo, on le stocke en variable de session
        socket.on('nouveau_client', function() {
            // pseudo = ent.encode(pseudo);
            // socket.pseudo = pseudo;
            socket.broadcast.emit('client_connected', socket.request.user.username);
        });

        // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
        socket.on('message', function (message) {
            message = ent.encode(message);
            socket.broadcast.emit('message', {'pseudo': socket.request.user.username, 'message': message});
            var db_message = new Message({ 'author': socket.request.user._id, 'message': message });
            db_message.save(function(err) {
              if (err) throw err;

              console.log('Message saved successfully!');
            });
        }); 

        socket.on('disconnect', function () {        
            socket.broadcast.emit('client_disconnect', socket.request.user.username);
        }); 


        socket.on("typing", function(data) {  
            if (typeof socket.request.user.username !== "undefined")
                socket.broadcast.emit("isTyping", {isTyping: data, person: socket.request.user.username});
        });
    });
};