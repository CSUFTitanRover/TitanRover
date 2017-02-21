var net = require('net');
var fs = require("fs");
var jsonfile = require('jsonfile');

var file = '/Users/insight/workspace/github/TitanRover/mobility/runt/node/gps.json';
var reachIP = '192.168.1.112';
var reach_shans_hotspot = '172.20.10.7';

var gpsJSON  = {
    'time': null,
    'latitude': null,
    'longitude': null 
};

var client = new net.Socket();
client.connect(9001, reach_shans_hotspot , function() {
	console.log('Connected to reach');
});

client.on('data', function(data,err) { 
    if(err){
        console.log("Error!: " + JSON.stringify(err));
    }
    data = data.toString().split(" ").filter(the_spaces);

    var gps_packet = {
            time: data[1],
            latitude: data[2],
            longitude: data[3],
            height: data[4],
            q: data[5]
        };
    jsonfile.writeFileSync(file, gps_packet);
});

client.on('close', function() {
	console.log('Connection closed');
});

function the_spaces(value) {
  return value !== '';
}
