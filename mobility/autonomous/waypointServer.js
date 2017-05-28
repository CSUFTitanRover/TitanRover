var app = require('express');
var socket = require('http').Server(app);
var io = require('socket.io')(socket);
var net = require('net');
var fs = require('fs');
var jsonfile = require('jsonfile');
var reachIP = '192.168.2.15';
var file = '/home/pi/TitanRover/mobility/runt/node/gps.json';

var gps_packet; // will be overwritten as new data is coming in from reach server
var temp_waypoint_list = [];

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

function the_spaces(value){
    return value !== '';
}

// Socket.io is going to be handling all the emits events that the UI needs.
io.on('connection', function(socketClient) {
    console.log("Client Connected: " + socketClient.id);

	// emit rover's location every 1.5 seconds
    setInterval(function() {
        var rover_location = {
          latitude: gps_packet.latitude,
          longitude: gps_packet.longitude
        };

        socketClient.emit('rover location', rover_location);
        // if the above doesnt work comment it out & try below
        //io.emit('rover location', rover_location);
    }, 1500);

    // request from UI
    socketClient.on('save waypoint', function(callback) {

        // pass off to callback supplied from UI
        callback(gps_packet);

        // save into our temp list
        const waypoint = {
            latitude: gps_packet.latitude,
            longitude: gps_packet.longitude
        };

        temp_waypoint_list.push(waypoint);
    });

    socketClient.on('delete recent waypoint', function () {
        temp_waypoint_list.pop();
    });

    socketClient.on('delete all waypoints', function () {
        temp_waypoint_list = [];
    });

    socketClient.on('save to file', function (callback) {
        jsonfile.writeFile(file, temp_waypoint_list, function(err) {
            if(err) {
		console.log("File did not save correctly.");
                callback(err)
            }
	    else {
                console.log("File saved correctly.");
	    }
        });
    });

});

process.on('SIGINT', function() {
    console.log("\n####### Waypoints Server shutting down #######\n");
    process.exit();
});
