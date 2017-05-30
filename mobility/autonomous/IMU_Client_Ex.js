var net = require('net');
var now = require('performance-now');
var moment = require('moment');

var imu_client = new net.Socket();

var currentHeading; 

imu_client.connect('/home/pi/TitanRover/GPS/IMU/Python_Version/imu_sock', function(){
    winston.info("Connected to IMU via UNIX socket ");
});

imu_client.on('data',function(data,err){
    if(err){
        winston.info('Error: ', err);
    }
    data = parseFloat(data);
    winston.info("*** UNIX sockets ***");
    winston.info("IMU Data: " + data);
    if (isNaN(data)) {
        winston.info("ERROR: Current Heading is NaN");
        stopRover();
    } else if ( 0 <= data && data <= 360){
        currentHeading = data;
    } else {
        winston.info("ERROR: IMU Heading Out of Range: " + data);
    }
});
imu_client.on('end',function(){
   console.log('ERROR: imu disconnected'); 
});