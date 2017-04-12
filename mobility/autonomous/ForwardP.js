var sys = require('util');

var finishedTraversal = false;
var executeTime = 5;
var throttlePercentageChange;
var throttleMultiplier;

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
var current_heading;
// Getting Heading
process.stdout.on('data', function (data){
	current_heading = parseFloat(data);
	//console.log('Current heading: ' + data.toString());
});
//*/

var forwardPMovement = function() {
    console.log("Calculating Current Deviation")

    //executes the forward movement for the rover
    rover.drive_forward();

    //Begin checking for any errors during our traversal and adjusting that over time. 
    turn_timer = setInterval(function(){
        //console.log( 'Turning ... Current heading: ' + current_heading + ' Target heading: ' + target_heading.toFixed(2));
        var heading_delta = current_heading - target_heading; 
            if(current_heading > target_heading){
                if(Math.abs(heading_delta) > 180){
                    heading_delta = 360 - current_heading + target_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('slowing turning right');
                    throttlePercentageChange = heading_delta/180
                    calcThrottleMultiplier();
                    right_scale_error_factor = 2995 * throttleMultiplier + pwm_min;
                    //left_scale_error_factor = pwm_max;
                }else{
                    heading_delta = current_heading - target_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('slow turning left');
                    throttlePercentageChange = heading_delta/180;
                    calcThrottleMultiplier();
                    left_scale_error_factor = 2995 * throttleMultiplier + pwm_min;
                    //right_scale_error_factor = pwm_max;
                    }
            }else{
                if(Math.abs(heading_delta) > 180){
                    heading_delta = 360 - target_heading + current_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('slowly turning left');
                    throttlePercentageChange = heading_delta/180
                    calcThrottleMultiplier();
                    left_scale_error_factor = 2995 * throttleMultiplier + pwm_min;
                    //right_scale_error_factor = pwm_max;

                }else{
                    heading_delta = target_heading - current_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('slowly turning right');
                    throttlePercentageChange = heading_delta/180
                    calcThrottleMultiplier();
                    right_scale_error_factor = 2995 * throttleMultiplier + pwm_min;
                    //left_scale_error_factor = pwm_max;
                }
            }

        // If we are within x degrees of the desired heading stop, else check if we overshot
        console.log('Delta test: ' + heading_delta);
        if(Math.abs(heading_delta) <= 1){
            rover.drive_forward();
            clearInterval(turn_timer);
            //console.log('on_target: + current heading');
            setTimeout(function(){console.log(current_heading)},1000);
        }
        else if(previous_heading_delta !== null && previous_heading_delta < heading_delta){
            clearInterval(turn_timer);
            forwardPMovement();
        }
        previous_heading_delta = heading_delta;
        console.log(left_scale_error_factor);
        console.log(right_scale_error_factor);
        rover.set_speed(left_scale_error_factor, right_scale_error_factor);
    },15);    
};

var calcThrottleMultiplier = function() {
    console.log("Throttle Percentage Change: " + throttlePercentageChange);
    throttleMultiplier = 1-throttlePercentageChange;
    console.log(throttleMultiplier);
}

var main = setInterval(function(){
    if(current_heading != null){
        clearInterval(main);
        forwardPMovement();
        //setTimeout(function(){;},1000);
    }
    
},500);