var assert = require('chai').assert;

var io = require('socket.io-client');

var testPort = 1234;
var createServer = require('./server.js');
createServer(testPort);

describe('P2P Proxy', function() {
  describe('socket connections', function () {
    it('should register two participants by address and enable communication', function (done) {
      var plan = new Plan(2, done);

      var address1 = '1234567890';
      var address2 = '0987654321';

      var socket1 = io.connect('http://localhost:' + testPort);
      var socket2 = io.connect('http://localhost:' + testPort);

      socket1.on('connect', function() {
          socket1.emit('register', { address: address1});
      });
      socket2.on('connect', function() {
          socket2.emit('register', { address: address2});
          socket2.emit('send', {to: address1, payload: {text: 'Hello from number two'}});
      });

      socket1.on('receive', function(data) {
          assert.equal(data.text, 'Hello from number two');
          socket1.emit('send', {to: address2, payload: {text: 'Hello from number one'}});
          plan.ok();
      });

      socket2.on('receive', function(data) {
          assert.equal(data.text, 'Hello from number one');
          plan.ok();
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