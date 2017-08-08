var net = require('net');
var reachIP = '192.168.2.15';
var client = new net.Socket();
var now = require('performance-now');
var Winston = require('winston');

const winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
          'colorize': true    
     }),
      new (Winston.transports.File)({ 
          filename: './networkTest.log',
          options:{flags: 'w'}, // Overwrite logfile. Remove if you want to append 
          timestamp: function () {
          return now();},
     })
    ]
  });

client.connect(9001, reachIP, function() {
	winston.info('Connected to reach');
});

client.on('data', function(data,err) { 
//	winston.info(String(data));
    if(err){
        winston.info("Error!: " + JSON.stringify(err));
    }
    // Parse the data into an array
    data = data.toString().split(" ").filter(theSpaces);
    currentLocation = {
            latitude: data[2],
            longitude: data[3]
        };
    winston.info('current location: ', currentLocation);
});

function theSpaces(value) {
  return value !== '';
}

