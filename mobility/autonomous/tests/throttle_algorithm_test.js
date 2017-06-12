var sys = require('util');

var throttlePercentageChange;
var current_heading= 30;
var target_heading = 65; 

var forward_drive_constant = 50;

var turning_left = null;
var turning_right = null;

var throttle_min = -127; //Minimum throttle value acceptable
var throttle_max = 127; //Maximum throttle value acceptable

main = setInterval(function() {
    //console.log("in main")
    current_heading++;
    if (current_heading <= 95) {
        calc_heading_delta();
        console.log("heading dealta: " + heading_delta);
        throttlePercentageChange = heading_delta/180
        var oldMotorvalue = Math.round(forward_drive_constant * throttlePercentageChange);
        var motorValue = (Math.round(forward_drive_constant * throttlePercentageChange))*Math.round(Math.log(heading_delta));
        console.log("Motor Variable: " + motorValue);
        console.log("Old Motor Variable: " + oldMotorvalue);

        var oldTurningValue = Math.round(throttle_max * throttlePercentageChange * 2);
        var newTurningValue = (30 + (Math.round(throttle_max * throttlePercentageChange * 2)));
        console.log("Turning Variable: " + newTurningValue);
        console.log("Old turning Variable: " + oldTurningValue);
    }
},200);

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
