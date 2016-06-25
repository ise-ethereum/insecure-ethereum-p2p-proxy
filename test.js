var assert = require('chai').assert;

var io = require('socket.io-client');

var testPort = 1234;
var createServer = require('./server.js');
createServer(testPort);

describe('P2P Proxy', function() {
  describe('socket connections', function () {
    it('should register two participants by address and enable communication', function (done) {
      var plan = new Plan(2, done);

      var address1 = 'participant-one';
      var address2 = 'participant-two';
      var address3 = 'not-participating';

      var socket1 = io.connect('http://localhost:' + testPort);
      var socket2 = io.connect('http://localhost:' + testPort);
      var socket3 = io.connect('http://localhost:' + testPort);

      // Step 1, connect three sockets and register them
      socket1.on('connect', function() {
          socket1.emit('register', { address: address1});
      });
      socket2.on('connect', function() {
          socket2.emit('register', { address: address2});
          setTimeout(function(){
            // Step 2, send from socket 2 to socket 1
            socket2.emit('send', {from: address2, to: address1, payload: {text: 'Hello from number two'}});
          }, 150);
      });
      socket3.on('connect', function() {
          socket3.emit('register', { address: address3});
      });

      // Step 3, received at socket 1
      socket1.on('receive', function(data) {
          assert.equal(data.payload.text, 'Hello from number two');
          assert.equal(data.from, address2);
          setTimeout(function() {
            // Step 4, send from socket 1 to socket 2
            socket1.emit('send', {from: address1, to: address2, payload: {text: 'Hello from number one'}});
          }, 150);
          plan.ok();
      });

      // Step 5, receive on socket 2
      socket2.on('receive', function(data) {
          assert.equal(data.payload.text, 'Hello from number one');
          assert.equal(data.from, address1);
          plan.ok();
      });

      // Should never receive anything on socket 3
      socket3.on('receive', function(data) {
          assert(false, 'Non-participating socket should not receive a message.');
      });
    });
  });
});


function Plan(count, done) {  
  this.done = done;
  this.count = count;
}

Plan.prototype.ok = function() {  
  if (this.count === 0) {
    assert(false, 'Too many assertions called');
  } else {
    this.count--;
  }
  if (this.count === 0) {
    this.done();
  }
};