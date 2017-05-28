var rover = require('./runt_pyControl.js');
var pwm_min = 1100; // Calculated to be 1000 us
var pwm_max = 4095; // Calculated to be 2000 us
var sleep = require('sleep');
var throttle = pwm_min; 
rover.turn_left()

turn_within_seconds = 5000; 
desired_speed = 4000;


var speed_timer = setInterval(function(){
    delta_speed = Math.abs(throttle - desired_speed)
    var increment = 200;
    throttle = throttle + increment;
    rover.set_speed(throttle,throttle);
    
    if(throttle >= desired_speed){
        setTimeout(function(){
            clearInterval(speed_timer);
            rover.stop();
        },1);
       
    }
},400)
   


// var alternating = setInterval(function(){
//     throttle = throttle + 1000;
//     rover.set_speed(throttle)
//     sleep.msleep(2000);
//     throttle = throttle - 1000;
//     rover.set_speed(throttle)
    
// },100)