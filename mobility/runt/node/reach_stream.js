/*
  Titan Rover - Reach Stream
  Description:
		Writing the GPS coordinates from the reach to the gps.json file. 
        This will only write one line of gps data and replace that line with the most recent GPS data. 
*/

var net = require('net');
var fs = require("fs");
var jsonfile = require('jsonfile');

var file = '/home/pi/TitanRover/mobility/runt/node/gps.json' ; 
var reachIP = '192.168.2.15';
var reach_shans_hotspot = '172.20.10.7';

var gpsJSON  = {
    'time': null,
    'latitude': null,
    'longitude': null 
};

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

    // Parse the data into an array
    data = data.toString().split(" ").filter(the_spaces);

    var gps_packet = {
            time: data[1],
            latitude: data[2],
            longitude: data[3],
            height: data[4],
            q: data[5]
        };
    console.log(data[2] + " " + data[3])
    //jsonfile.writeFileSync(file, gps_packet);
});

client.on('close', function() {
	console.log('Connection closed');
});

function the_spaces(value) {
  return value !== '';
}
