var sys = require('util');

var finishedTraversal = false;
var executeTime = 5;
var throttlePercentageChange;
var throttlePercentageChange;

var target_heading = 65;
var previous_heading_delta;

/*COMMENT THIS OUT IF YOU WISH TO TEST WITH THE RUNT ROVER
var inital_current_heading=15;
var inital_target_heading=20;
var target_heading;
var current_heading;
*/

///*COMMENT THIS OUT IF YOU WISH TO TEST WITHOUT THE RUNT ROVER
var spawn = require("child_process").spawn;
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');
var pwm_min = 1100; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var drive_constant = 2600;
var acceptable_Degree_Error = 2;
var currentLeftThrottle;
var currentRightThrottle;
var previousRightThrottle;
var previousLeftThrottle;
var current_heading;
var heading_delta;

var turning_left = null;
var turning_right = null;

var driveCounter;

//Adding winston logger into script for file generation support, implemented by Shan
/*
const Winston = require('winston');
const winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
          'colorize': true
          
     }),
      new (Winston.transports.File)({ 
          filename: './autonomous.log',
          options:{flags: 'w'},         // Overwrites logfile. Remove if you want to append 
          timestamp: function () {
          return NOW();},
     })
    ]
  });
*/

// Getting Heading, implemented by Shan
process.stdout.on('data', function (data){
	current_heading = parseFloat(data);
	//console.log('Current heading: ' + data.toString());
});
//*/

// Cleanup procedures, implemented by Shan
process.on('SIGINT',function(){;
    rover.stop();
    console.log('shutting rover down.')
    process.exit();
});

//Drives the rover forward and making any adjustments along the way.
var forwardPMovement = function() {
    console.log('----ForwardPmovement----')
    rover.drive_forward();
    drive_timer = setInterval(function() {
        calc_heading_delta();
        console.log("Current Heading: " + current_heading);
        console.log("Target Heading: " + target_heading);
        console.log("Heading Delta: " + heading_delta)
        console.log("Turning left?:" + turning_left);
        console.log("Turning right?:" + turning_right);
        if (Math.abs(heading_delta) <= acceptable_Degree_Error) {
            rover.set_speed(drive_constant, drive_constant);
            console.log('Moving forward at drive constant');
            driveCounter++;
        } else {
            //Calculate the throttle percentage change based on what the proportion is.
            throttlePercentageChange = heading_delta/180
            console.log('turning_left: ' + turning_left);
            console.log('turning_right:' + turning_right);
            if(turning_right){
                    console.log('Slowing turning right');
                    currentLeftThrottle = drive_constant + (drive_constant * throttlePercentageChange);
                    currentRightThrottle = drive_constant - (drive_constant * throttlePercentageChange);
            }else if(turning_left){
                    console.log('Slowing turning left');
                    currentLeftThrottle = drive_constant - (drive_constant * throttlePercentageChange);
                    currentRightThrottle = drive_constant + (drive_constant * throttlePercentageChange);
            } else {
                console.log('ERROR - Cannot slowly turn left or right');
            }
        }
        //Checks to see if the currentThrottle values are valid for mechanical input as it is possible that the values can be significantly more or
        //less than pwm_min and pwm_max. Then sets the rover speed to the calculated value

        if (currentLeftThrottle < pwm_max && currentLeftThrottle > pwm_min &&  currentRightThrottle < pwm_max && currentRightThrottle > pwm_min){
            rover.set_speed(currentLeftThrottle, currentRightThrottle);
            previousLeftThrottle = currentLeftThrottle;
            previousRightThrottle = currentRightThrottle;
        } else {
            //In a later implementtion I want to call turn.js, as if we're trying to adjust this far we're way off on our heading. 
            console.log('Throttle Value outside of PWM range');
            //checks the leftThrottle values to make sure they're within mechanical constraints
            if (currentLeftThrottle > pwm_max){
                currentLeftThrottle = pwm_max;
            } else if (currentLeftThrottle < pwm_min) {
                currentLeftThrottle = pwm_min;
            } else {
                console.log('ERROR - leftThrottle values undefined');
                rover.stop();
                clearInterval(drive_timer);
            }

            //checks the rightThrottle values to make sure they're within mechanical constraints
            if (currentRightThrottle > pwm_max) {
                currentRightThrottle = pwm_max;
            } else if (currentRightThrottle < pwm_min) {
                currentRightThrottle = pwm_min;
            } else {
                console.log('ERROR - rightThrottle values undefined');
                rover.stop();
                clearInterval(drive_timer);
            }
        }
        rover.set_speed(currentLeftThrottle, currentRightThrottle);
        if (driveCounter > 20) {
            clearInterval(drive_timer);
            rover.stop();
            console.log('On Heading...Stopping...');
        } else {
            console.log('Thottle Adjusted');
        }
    },50);
};

//grabbed shan's calc_heading_delta() that we worked on together for the turning/heading logic
function calc_heading_delta(){
    console.log('Calculating Heading Delta & Direction');
    temp_delta = current_heading - target_heading;
    console.log('temp_delta: ' + temp_delta);
// Is turning left or right the shorter turn?
    if(current_heading > target_heading){
        if(Math.abs(temp_delta) > 180){
            // If we were turning left previously or have never turned right before
            if(turning_left || turning_right === null){
                console.log('turning right: '+ current_heading);
                turning_right = true;
                turning_left = false;
            }
            heading_delta = 360 - current_heading + target_heading;
        }else{
              // If we were turning right previously or have never turned left before
             if(turning_right || turning_left === null){
                console.log('turning left: '+ current_heading);
                turning_left = true;
                turning_right = false;
            }
            heading_delta = current_heading - target_heading;
            }
    }else{
        if(Math.abs(temp_delta) > 180){ 
             if(turning_right || turning_left === null){
                console.log('turning left: '+ current_heading);
                turning_left = true;
                turning_right = false;
            }
            heading_delta = 360 - target_heading + current_heading;
        }else{
            if(turning_left || turning_right === null){
                console.log('turning right: '+ current_heading);
                turning_right = true;
                turning_left = false;
            }
            heading_delta = target_heading - current_heading;
        }
    } 
}

var main = setInterval(function(){
    if(current_heading != null){
        clearInterval(main);
        forwardPMovement();
        //setTimeout(function(){;},1000);
    }
    
},500);