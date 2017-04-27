


//----FORWARDP MOVEMENT----
/* ForwardP movement constantly adjusts the rovers controls over forward drive to readjusted for any difference in heading.

MAPPIING ROVER CONTROLS:
Atlas rover drive controls is by mapping joystick points. Using range of (-127,127)x and (-127,127)y
    - x Corresponds to left and right control, -127 is full speed right, 127 is full speed left
    - y Corresponds to forward and backward control, -127 is full speed backward, 127 is full speed forward */ 

//----REQUIRED----
var sys = require('util');
var spawn = require("child_process").spawn;
var rover = require('./runt_pyControl.js');
//----VARIABLES----
var finishedTraversal = false;
var executeTime = 5;

//DRIVE-CONSTANT: 
//30 - UNTESTED, UNSURE OF SPEED, BE AWARE WHEN TESTING
var drive_constant = 30;

//DEGREE OF ERROR
//2 DEGREES - Currenly untested on Atlas, may adjust over time. 
var acceptable_Degree_Error = 2;

var throttlePercentageChange;

var x_axis_throttle;
var x_axis_throttle_previous;
var x_axis_max = 127;
var x_axis_min = -127;


var turning_left = null;
var turning_right = null;

var driveCounter = 0;

var heading_delta;
var previous_heading_delta;

//FOR OFF ROVER TESTING:
//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading = 360;
var target_heading = 65;
//THEN COMMENT THIS OUT
/*
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
process.stdout.on('data', function (data){
	current_heading = parseFloat(data);
	//console.log('Current heading: ' + data.toString());
});

//*/
/*FOR MOTOR HAT THAT HAS BEEN REMOVED, SAVING INCASE WE SWAP BACK
var x_axis_min = 0; // Calculated to be 1000 us
var x_axis_max = 255; // Calculated to be 2000 us
var drive_constant = 127;
*/


//----WINSTON LOGGER----
//COMMENTED OUT CURRENTLY AS IT WAS NOT WORKING PROPERLY
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

// Cleanup procedures, implemented by Shan
process.on('SIGINT',function(){;
    //rover.stop();
    console.log('shutting rover down.')
    process.exit();
});

//Drives the rover forward and making any adjustments along the way.
var forwardPMovement = function() {
    console.log('----ForwardPmovement----')
    //rover.drive_forward();
    drive_timer = setInterval(function() {
        //FOR TESTING OFF ROVER
        driveCounter++;
        current_heading--;
        //---------------------
        calc_heading_delta();
        console.log("Current Heading: " + current_heading);
        console.log("Target Heading: " + target_heading);
        console.log("Heading Delta: " + heading_delta)
        console.log("Turning left: " + turning_left); //boolean value
        console.log("Turning right: " + turning_right);//boolean value
        if (Math.abs(heading_delta) <= acceptable_Degree_Error) {
            x_axis_throttle = drive_constant;
            x_axis_throttle = drive_constant;
            console.log('MOVING FORWARD AT DRIVE CONSTANT');
        } else {
            console.log("NOT WITHIN ACCEPTABLE DEGREE OF ERROR");
            //Calculate the throttle percentage change based on what the proportion is.
            //TROTTLE PERCENTAGE CHANGE FORMULA MAY BE ADJUSTED OVER TIME DEPENDING ON ATLAS SPEED
            throttlePercentageChange = heading_delta/360
            console.log('ThrottlePercentageChange: ' + throttlePercentageChange);
            console.log('turning_left: ' + turning_left);
            console.log('turning_right:' + turning_right);
            if(turning_right){
                    console.log('Slowing turning right');
                    x_axis_throttle = (x_axis_max*throttlePercentageChange);
                    console.log('Raw x_axis_throttle: ' + x_axis_throttle);
            }else if(turning_left){
                    console.log('Slowing turning left');
                    x_axis_throttle = 0 - (x_axis_max*throttlePercentageChange);
                    console.log('Raw x_axis_throttle: ' + x_axis_throttle);
            } else {
                console.log('ERROR - Cannot slowly turn left or right');
            }
        }
        //Checks to see if the currentThrottle values are valid for mechanical input as it is possible that the values can be significantly more or
        //less than x_axis_min and x_axis_max. Then sets the rover speed to the calculated value
        x_axis_throttle = Math.round(x_axis_throttle);
        console.log('Rounded x_axis_throttle: ' + x_axis_throttle);
        if (Math.abs(x_axis_throttle) < x_axis_max && x_axis_throttle > x_axis_min){
            console.log('Sending x_axis_throttle: ' + x_axis_throttle);
            //rover.set_speed(Math.trunc(currentLeftThrottle), Math.trunc(x_axis_throttle));
            x_axis_throttle_previous = x_axis_throttle;
        } else {
            //In a later implementtion I want to call turn.js, as if we're trying to adjust this far we're way off on our heading. 
            console.log('Throttle Value outside of PWM range');
            //checks the x_axis_throttle values to make sure they're within mechanical constraints
            if (x_axis_throttle > x_axis_max){
                x_axis_throttle = 0;
                console.log("ERROR: EXTREME OUT OF BOUNDS: " + x_axis_throttle);
            } else if (x_axis_throttle < x_axis_min) {
                x_axis_throttle = 0;
                console.log("ERROR: EXTREME OUT OF BOUNDS: " + x_axis_throttle);
            } else {
                console.log('ERROR: THROTTLE VALUES UNDEFINED');
                //rover.stop();
                clearInterval(drive_timer);
            }
        }
        //rover.set_speed(Math.trunc(x_axis_throttle), Math.trunc(x_axis_throttle));
        if (driveCounter > 361) {
            clearInterval(drive_timer);
            //rover.stop();
            console.log('On Heading...Stopping...');
        } else {
            console.log('Thottle Adjusted');
        }
    },100);
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
    
},50);