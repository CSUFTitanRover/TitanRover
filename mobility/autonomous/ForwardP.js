var sys = require('util');

var finishedTraversal = false;
var executeTime = 5
var throttle

var spawn = require("child_process").spawn;
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');
var pwm_min = 1100; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var current_heading;
// Getting Heading
process.stdout.on('data', function (data){
	current_heading = parseFloat(data);
	//console.log('Current heading: ' + data.toString());
});

var heading_delta = current_heading - target_heading;
if(current_heading > target_heading){
        if(Math.abs(heading_delta) > 180){
            heading_delta = 360 - current_heading + target_heading;
            console.log("Current Heading: " + current_heading);
            console.log("Target Heading: " + target_heading);
            console.log("Heading Delta: " + heading_delta)
            console.log('slowing turning right');
            throttle = heading_delta/180
        }else{
            heading_delta = current_heading - target_heading;
            console.log("Current Heading: " + current_heading);
            console.log("Target Heading: " + target_heading);
            console.log("Heading Delta: " + heading_delta)
            console.log('slow turning left');
            throttle = heading_delta/180
            }
    }else{
        if(Math.abs(heading_delta) > 180){
            heading_delta = 360 - target_heading + current_heading;
            console.log("Current Heading: " + current_heading);
            console.log("Target Heading: " + target_heading);
            console.log("Heading Delta: " + heading_delta)
            console.log('slowly turning left');
            throttle = heading_delta/180
        }else{
            heading_delta = target_heading - current_heading;
            console.log("Current Heading: " + current_heading);
            console.log("Target Heading: " + target_heading);
            console.log("Heading Delta: " + heading_delta)
            console.log('slowly turning right');
            throttle = heading_delta/180
        }
}