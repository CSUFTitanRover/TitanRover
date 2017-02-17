/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/



var net = require('net');
var fs = require("fs");
var reachIP = '192.168.1.112'
var reach_shans_hotspot = '172.20.10.7'
var gpsJSON  = {
    'time': null,
    'latitude': null,
    'longitude': null 
};
// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
// });

// server.listen(3000, '127.0.0.1');




/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');

var client = new net.Socket();
client.connect(9001, reach_shans_hotspot , function() {
	console.log('Connected');
});

client.on('data', function(data) {
	//console.log('Received: ' + data);
    data = data.toString().split(" ").filter(the_spaces);
    
     gpsJSON.time = gpsJSON.time + data[1];
     gpsJSON.lon =  gpsJSON.lon + data[2];
     gpsJSON.lat =  gpsJSON.lat + data[3];
    
    setTimeout(function(){
        console.log(gpsJSON);
    },5000);
    
   


});

client.on('close', function() {
	console.log('Connection closed');
});



function the_spaces(value) {
  return value !== '';
}
