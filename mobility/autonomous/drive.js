var sys = require('util');
var spawn = require("child_process").spawn;
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');
const NOW = require("performance-now");
var pwm_min = 2000; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var current_heading;
var  target_heading = 65;
var throttle_default = 2200; 
var proportional_error = 1500;
var slight_right = null;
var slight_left = null;
var DELTA_THRESHOLD = 5;

var time_within_threshold = 0; 

const Winston = require('winston');
const winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
          'colorize': true
          
     }),
      new (Winston.transports.File)({ 
          filename: './drive.log',
          options:{flags: 'w'}, // Overwrites logfile. Remove option if you want to append 
          timestamp: function () {
          return NOW();},
     })
    ]
  });


python_proc.stdout.on('data', function (data){
    current_heading = parseFloat(data);
    calc_heading_delta();
});


var throttle_timer = setInterval(function(){
    winston.info('Current heading: ' + data.toString());
    proportional_error = heading_delta / 90;
    var adjusted_throttle = throttle_default - (throttle_default * proportional_error);
    
    // If we are within the threshold maintain default speed
    if(heading_delta <= DELTA_THRESHOLD){
        winston("On target..");
        time_within_threshold = NOW(); 
        rover.set_speed(throttle_default,throttle_default);
    }
    else if(heading_delta > 90){
        winston.info('Waaay off. Need to stop and turn again ');
        rover.stop();
    }
    // else adjust slight right, slight left speeds. 
    else{
        time_within_threshold = NOW() - time_within_threshold;
        winston("Stayed on course for: " + time_within_threshold + " ms");

        if(slight_right){
             rover.set_speed(adjusted_throttle,throttle_default);
        }
        else{
            rover.set_speed(throttle_default,adjusted_throttle);
           
        }
    }
        
},400);

/* 
    Temp delta is needed to figure out our orientation with respect to the target heading. 
    Assuming, our heading is between 0-360, the heading delta will always be positive.
*/
function calc_heading_delta(){
    // Calculating error (heading_delta)
    temp_delta = current_heading - target_heading;
    
    if(current_heading > target_heading){
        
        if(Math.abs(temp_delta) > 180){
            // Target is slightly right
            heading_delta = 360 - current_heading + target_heading;
            slight_right = true;
        }else{
            heading_delta = current_heading - target_heading;
            slight_left = true;
        }
    }else{
        if(Math.abs(temp_delta) > 180){
            // Target is slightly left
            heading_delta = 360 - target_heading + current_heading;
            slight_left = true;
        }else{
            heading_delta = target_heading - current_heading;
            slight_right = true;
        }
    }
    
} 

rover.drive_forward();