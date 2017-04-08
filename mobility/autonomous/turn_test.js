
var sys = require('util');
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


var turn_toward_target = function(){
    console.log('Initiating turn');
    var previous_heading_delta = null; 
    var  target_heading = 65;
	var heading_delta = current_heading - target_heading;
    var scale_error_factor;
    if(current_heading > target_heading){
        if(Math.abs(heading_delta) > 180){
            rover.turn_right();
			console.log('turning right');
        }else{
            rover.turn_left();
			console.log('turning left');
            }
    }else{
        if(Math.abs(heading_delta) > 180){
            rover.turn_left();
			console.log('turning left');
        }else{
            rover.turn_right();
			console.log('turning right');
        }
    }
    turn_timer = setInterval(function(){
        console.log( 'Turning ... Current heading: ' + current_heading + ' Target heading: ' + target_heading.toFixed(2));
        var heading_delta = current_heading - target_heading; 
  
        // If we are within x degrees of the desired heading stop, else check if we overshot
        if(Math.abs(heading_delta) <= 5){
            rover.stop();
            clearInterval(turn_timer);
            //console.log('on_target: + current heading');
            setTimeout(function(){console.log(current_heading)},1000);
        }
        else if(previous_heading_delta !== null && previous_heading_delta < heading_delta){
            clearInterval(turn_timer);
            turn_toward_target();
        }
        previous_heading_delta = heading_delta; 
        scale_error_factor = 2995 * (Math.abs(heading_delta)/180) + pwm_min;
        console.log(scale_error_factor);
        //rover.set_speed(scale_error_factor);
    
    },15);
};

turn_toward_target();


