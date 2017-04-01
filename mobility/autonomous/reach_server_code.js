/*
	This section creats a client which reads from the Reach:Rover *** NOT THE REACH:BASE ***.  The reach must have configured settings:
		-Known IP for the HOST address
		-Solution Output Path: tcpsvr 
		-Solution Output PORT #
		-Solution Output format: llh

	This script will update buffered waypoints from the Reach:Rover  
*/

'use strict';
var geolib = require('./geolib/geolib');
var net = require('net');
var HOST = '192.168.43.207';
var PORT = 9005;
var bufPoint;

var client = new net.Socket();

client.connect(PORT, HOST, function () {
    console.log('Connected to Server');
});

client.on('data', function (data) {
    var arr = data.toString().split(" ");
    bufPoint = {lat: Number(arr[4]), lon: Number(arr[5])};
    //Uncommit next line for error checking output of Rover:Reach server
    //console.log('Waypoint Latitude: ' + bufPoint.lat + ' and Longitude: ' + bufPoint.lon);
});

client.on('close', function() {
    client.end();
});
