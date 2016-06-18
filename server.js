var express = require('express');
var util = require('util');

function createServer(port) {
    var app = express();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    server.listen(port);
    util.log("Listening on :" + port);

    app.use(express.static('public'));

    io.on('connection', function(socket) {
      socket.on('register', function(data) {
        // Creates a room for every address
        var address = data.address;
        if (!address) {
            console.error('Error: You need to provide your own address for registration.');
            return;
        }
        // Join socket to room
        socket.join(data.address, function(err) {
            if (err) {
                console.error('Error: Could not register address. ' + err);
                return;
            }
            util.log('Registered ' + address);
        });
      });

      socket.on('send', function(data) {
        var toAddress = data.to;
        var payload = data.payload;
        if (!toAddress || !payload) {
            console.error('Error: Cannot send without address or payload.');
        }
        // Join socket to room of receiver
        socket.join(toAddress, function(err) {
            if (err) {
                console.error('Error: Could not join room with other participant. ' + err);
                return;
            }
            // Send payload to room of receiver
            socket.to(toAddress).emit('receive', payload);
            util.log('Sent to ' + toAddress);
        });
      });
    });
}

module.exports = createServer;