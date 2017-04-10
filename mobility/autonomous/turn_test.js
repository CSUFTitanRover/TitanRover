
var sys = require('util');
var spawn = require("child_process").spawn;
var process = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');
const now = require("performance-now");
var pwm_min = 2000; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var current_heading;
var proportional_error = 1500;
var DELTA_THRESHOLD = 1;


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

// Getting Heading
process.stdout.on('data', function (data){
    current_heading = parseFloat(data);
	//winston.info('Current heading: ' + data.toString());
});


var turn_toward_target = function(){
    winston.info('Initiating turn');
    var previous_heading_delta = null; 
    var  target_heading = 65;
	var heading_delta = current_heading - target_heading;

    winston.info('current heading before turn: ' + current_heading);
    if(current_heading > target_heading){
        winston.info('heading delta: '+ Math.abs(heading_delta));
        if(Math.abs(heading_delta) > 180){
            winston.info('turning right:'+ current_heading);
       
            rover.turn_right();
            heading_delta = 360 - current_heading + target_heading;
        }else{
            winston.info('turning left'+ current_heading);
            rover.turn_left();
            heading_delta = current_heading - target_heading;
            }
    }else{
        winston.info('heading delta: '+ Math.abs(heading_delta));
        if(Math.abs(heading_delta) > 180){
            winston.info('turning left'+ current_heading);
            rover.turn_left();
            heading_delta = 360 - target_heading + current_heading;
        }	
        else{
            winston.info('turning right'+ current_heading);
            rover.turn_right();
            heading_delta = target_heading - current_heading;
        }
    }
  
    var turn_timer = setInterval(function(){
        winston.info( 'Turning... Current heading: ' + current_heading + ' Target heading: ' + target_heading.toFixed(2));
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
        //winston.info('Delta test: ' + heading_delta);
        //winston.info((previous_heading_delta + 15) + ' ' + (heading_delta));
        if(Math.abs(heading_delta) <= DELTA_THRESHOLD){
            
            clearInterval(turn_timer);
            clearInterval(speed_timer);
            rover.stop();
            setTimeout(function(){
                winston.info('Final Heading:' + current_heading);
                if(Math.abs(current_heading-target_heading) > DELTA_THRESHOLD)
                {
                    turn_toward_target();
                    speed_timer();
                }
            },1000);
            winston.info('stopped heading: ' + current_heading);
           
        }
        
        else if(previous_heading_delta !== null && previous_heading_delta + 15  < heading_delta ){
            winston.info('overshot');
            clearInterval(turn_timer);
            turn_toward_target();
        }
        previous_heading_delta = heading_delta; 
        proportional_error = (pwm_max-pwm_min) * (Math.abs(heading_delta)/180) + pwm_min;
        
   },15);
}

var speed_timer = setInterval(function(){
            var inc = 1;
            proportional_error = proportional_error / inc;
            winston.info('throttle:' + proportional_error);
            if(proportional_error != null){
                rover.set_speed(proportional_error);
            }
            
        },250);


var main = setInterval(function(){
    if(current_heading != null){
        clearInterval(main);
        turn_toward_target();
    }
    
},500);
    
