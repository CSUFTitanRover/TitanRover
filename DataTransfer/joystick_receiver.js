/*
  Author: Joseph Porter
  Titan Rover - Joystick Receiver 
  Description: 
    
    This is receiving any UDP packets that come from
	the controller.
*/
var PORT = 5000;
var HOST = 'localhost';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

	// Place mobility code in here to read input

	// Place other subfunctions that will read the joystick data

});

server.bind(PORT, HOST);
