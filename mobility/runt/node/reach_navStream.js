var net = require('net');
var fs = require("fs");
var jsonfile = require('jsonfile');
geolib = require('geolib');

// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
// });

// server.listen(3000, '127.0.0.1');


var file = '/Users/insight/workspace/github/TitanRover/mobility/runt/node/gps.json';
var reachIP = '192.168.1.112';
var reach_shans_hotspot = '172.20.10.7';

 var ll_previous = null;
 var ll_current = null; 
var gpsJSON  = {
    'time': null,
    'latitude': null,
    'longitude': null 
};


var client = new net.Socket();
client.connect(9001, reach_shans_hotspot , function() {
	console.log('Connected to reach');
});

client.on('data', function(data) {
	//console.log('Received: ' + data);
    previousLL = 0;
    has_moved = false;  
    
    data = data.toString().split(" ").filter(the_spaces);

   if(ll_pre)
    var gps_packet = {
            time: data[1],
            latitude: data[2],
            longitude: data[3],
            height: data[4],
            q: data[5]
        };
        
    var gps_packet_dummy = {
                time: 123112,
                latitude: 12313,
                longitude: 12515,
                height: 23351,
                q: 15151
            };
    

    jsonfile.writeFileSync(file, gps_packet_dummy);
    

    if(ll_previous !== null){
        
        ll_current = gps_packet; 
        ll_previous = nowPoint; 
        var distance = geolib.getDistance(
        {latitude: lat_1, longitude: lon_1}, 
        {latitude: lat_2, longitude: lon_2},
        1, // Setting Accuracy to 1
        3  // Setting precision to centimeters 
        );
            
    hasMoved = function(gps_packet){
        distance =  geolib.getDistance(
            {latitude: lat_1, longitude: lon_1}, 
            {latitude: lat_2, longitude: lon_2},
            1, // Setting Accuracy to 1
            3  // Setting precision to centimeters 
            );
            
            return distance >= 3;
        };
    }
   
 
    
});

client.on('close', function() {
	console.log('Connection closed');
});


function the_spaces(value) {
  return value !== '';
}
