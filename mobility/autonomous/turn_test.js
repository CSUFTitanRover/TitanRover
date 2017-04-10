
var sys = require('util');
var spawn = require("child_process").spawn;
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');
var pwm_min = 1100; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var current_heading;
var proportional_error;
// Getting Heading
process.stdout.on('data', function (data){
	current_heading = parseFloat(data);
	//console.log('Current heading: ' + data.toString());
});
var turn_once = false;

var turn_toward_target = function(){
    console.log('Initiating turn');
    var previous_heading_delta = null; 
    var  target_heading = 65;
	var heading_delta = current_heading - target_heading;
    
    
    if(current_heading > target_heading){
        if(Math.abs(heading_delta) > 180){
            console.log('turning right');
       
            rover.turn_right();
            heading_delta = 360 - current_heading + target_heading;
        }else{
            console.log('turning left');
            rover.turn_left();
            heading_delta = current_heading - target_heading;
            }
    }else{
        if(Math.abs(heading_delta) > 180){
            console.log('turning left');
            rover.turn_left();
            heading_delta = 360 - target_heading + current_heading;
			
        }else{
            console.log('turning right');
            rover.turn_right();
            heading_delta = target_heading - current_heading;
        }
    }

    var turn_timer = setInterval(function(){
        console.log( 'Turning ... Current heading: ' + current_heading + ' Target heading: ' + target_heading.toFixed(2));
        var heading_delta = current_heading - target_heading; 
        if(current_heading > target_heading){
            if(Math.abs(heading_delta) > 180){
                heading_delta = 360 - current_heading + target_heading;
            }else{
                heading_delta = current_heading - target_heading;
                }
        }else{
            if(Math.abs(heading_delta) > 180){ 
                heading_delta = 360 - target_heading + current_heading;
            }else{
                heading_delta = target_heading - current_heading;
            }
        }
        // If we are within x degrees of the desired heading stop, else check if we overshot
        //console.log('Delta test: ' + heading_delta);
        console.log(previous_heading_delta + ' ' + (heading_delta + 4));
        if(Math.abs(heading_delta) <= 10){
            rover.stop();
            clearInterval(turn_timer);
            clearInterval(speed_timer);
            setTimeout(function(){console.log('on_target:' + current_heading);},1000);
        }
        
        else if(previous_heading_delta !== null && previous_heading_delta + 15  < heading_delta ){
            console.log('overshot');
            clearInterval(turn_timer);
            turn_toward_target();
        }
        previous_heading_delta = heading_delta; 
        proportional_error = 2995 * (Math.abs(heading_delta)/180) + pwm_min;
        
        
        

       
 
   },15);
};

var speed_timer = setInterval(function(){
            var inc = 1;
            proportional_error = proportional_error / inc;
            console.log('average:' + proportional_error);
            rover.set_speed(proportional_error);
        },900);

turn_toward_target();


