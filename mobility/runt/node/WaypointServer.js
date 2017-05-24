var app = require('express');
var socket = require('http').Server(app);
var io = require('socket.io')(socket);
var net = require('net');
var reachIP = '192.168.2.15';
var gps_packet; // will be overwritten as new data is coming in from reach server

// Start the server
socket.listen(9999, function() {
    console.log("============ Waypoints Server is up and running on port: ", socket.address().port, "=============");
});

// Connect to the reach server * you can set the reachs server information in the WebUI
var raspi_client = new net.Socket();
raspi_client.connect(9001, reachIP, function() {
    console.log('Connected to reach');
});

// When we get a data packet from the reach
raspi_client.on('data', function(data,err) {
//	console.log(String(data));
    if(err){
        console.log("Error!: " + JSON.stringify(err));
    }

    /* Example data object from the reach stream
     GPST latitude(deg) longitude(deg)  height(m)   Q  ns   sdn(m)   sde(m)   sdu(m)  sdne(m)  sdeu(m)  sdun(m) age(s)  ratio
     1934 433341.500   33.882028059 -117.882559268    38.7224   5   4   3.9905   3.7742   9.1639   2.7016   4.4366   4.2998   0.00    0.0

     */

    // Parse the data into an array
    data = data.toString().split(" ").filter(the_spaces);

    gps_packet = {
        time: data[1],
        latitude: data[2],
        longitude: data[3],
        height: data[4],
        q: data[5]
    };
});

// Socket.io is going to be handling all the emits events that the UI needs.
io.on('connection', function(socketClient) {
    console.log("Client Connected: " + socketClient.id);

    // request from UI
    socketClient.on('save waypoint', function() {
        // received a new angle value from the client
        // inside here you can call Turn.js and pass along newAngle
        console.log('Attempting to grab lat, lng from Reach server');

        // code to grab from reach server

        socketClient.emit('current waypoint', gps_packet);
    });

});

process.on('SIGINT', function() {
    console.log("\n####### Waypoints Server shutting down #######\n");
    process.exit();
});