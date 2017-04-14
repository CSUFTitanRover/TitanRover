var sys = require('util');
var spawn = require("child_process").spawn;
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');
const now = require("performance-now");
var pwm_min = 2000; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var current_heading;
var proportional_error = 1500;
var DELTA_THRESHOLD = 5;

const Winston = require('winston');
const winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
          'colorize': true
          
     }),
      new (Winston.transports.File)({ 
          filename: './autonomous.log',
          options:{flags: 'w'}, // Overwrite logfile. Remove if you want to append 
          timestamp: function () {
          return now();},
     })
    ]
  });

python_proc.stdout.on('data', function (data){
    current_heading = parseFloat(data);
	//winston.info('Current heading: ' + data.toString());
    calc_heading_delta();
});

rover.drive_forward();

var steer_timer = setInterval(function(){
  
});
  


function calc_heading_delta(){
    // Calculating error (heading_delta)
    temp_delta = current_heading - target_heading;
    if(current_heading > target_heading){
        if(Math.abs(temp_delta) > 180){
            heading_delta = 360 - current_heading + target_heading;
        }else{
            heading_delta = current_heading - target_heading;
        }
    }else{
        if(Math.abs(temp_delta) > 180){
            heading_delta = 360 - target_heading + current_heading;
        }else{
            heading_delta = target_heading - current_heading;
        }
    }
    
} 