/*
Author: Timothy Parks
This example serves to show how the geolib library will be used with waypoints
*/

'use strict';
var geolib = require('geolib');
var finalpoint = false;
var distance = 0;
var currentHeading = 0;
var wayPoints = [
    {lat: 0,   lon: 0},//Los Angeles, CA (34.052222, -118.243611) is 133974200 cm 245.74Degrees
    {lat: 0,   lon: 0}];

var net = require('net');
var fs = require("fs");
var jsonfile = require('jsonfile');

var file = '/home/pi/TitanRover/mobility/runt/node/gps.json' ; 
var reachIP = '192.168.2.15';
var reach_shans_hotspot = '172.20.10.7';
var current_wayPoint = 0;
var gpsJSON  = {
    'time': null,
    'latitude': null,
    'longitude': null 
};

var printInfo = setInterval(function(){
    if(current_wayPoint > 0){
        current_wayPoint = 0;
        //clearInterval(printInfo);
        //get IMU heading
        //current_wayPoint = Reach network connection
        console.log("Start Position = " + wayPoints[current_wayPoint].lat + ' ' + wayPoints[current_wayPoint].lon);
        
        console.log("Ending Position = " + "33.77234" + ' ' + "-117.882550");
// 33.88234 -117.882550
        //The getDistance formula is accurate to 1 meter
        wayPoints[1].lat = 33.882086;
        wayPoints[1].lon = -117.882440;
        distance = geolib.getDistance(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1],1,5);
        distance = geolib.convertUnit('m',distance);
        currentHeading = geolib.getBearing(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1]);
        console.log("Current Distance: " + distance + "m at a bearing of " + currentHeading);
        console.log();
    }
},10);

// Connect to the reach server * you can set the reachs server information in the WebUI 
var client = new net.Socket();
client.connect(9001, reachIP, function() {
	console.log('Connected to reach');
});

// When we get a data packet from the reach
client.on('data', function(data,err) { 
//	console.log(String(data));
    if(err){
        console.log("Error!: " + JSON.stringify(err));
    }
    
    /* Example data object from the reach stream 
        GPST latitude(deg) longitude(deg)  height(m)   Q  ns   sdn(m)   sde(m)   sdu(m)  sdne(m)  sdeu(m)  sdun(m) age(s)  ratio
        1934 433341.500   33.882028059 -117.882559268    38.7224   5   4   3.9905   3.7742   9.1639   2.7016   4.4366   4.2998   0.00    0.0
    
    */

    if(current_wayPoint < 1){
        // Parse the data into an array
        data = data.toString().split(" ").filter(the_spaces);

        var gps_packet = {
                time: data[1],
                latitude: data[2],
                longitude: data[3],
                height: data[4],
                q: data[5]
            };
        wayPoints[current_wayPoint].lat = data[2];
        wayPoints[current_wayPoint].lon = data[3];
        current_wayPoint++;
        //console.log(data[2] + " " + data[3])
        //jsonfile.writeFileSync(file, gps_packet);
    }
});

client.on('close', function() {
	console.log('Connection closed');
});

function the_spaces(value) {
  return value !== '';
}
