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

    /* Register an address */
    socket.on('register', function(data) {
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

    /* Relay a message */
    socket.on('send', function(data) {
      var toAddress = data.to;
      var fromAddress = data.from;
      var payload = data.payload;
      if (!toAddress || !payload) {
          console.error('Error: Cannot send without address or payload.');
      }
      // Send payload to room of receiver
      socket.to(toAddress).emit('receive', data);
      util.log('New message:\n  from: ' + fromAddress + '\n  to: ' + toAddress + '\n  topic: ' + data.topic);
    });

  });
}

module.exports = createServer;