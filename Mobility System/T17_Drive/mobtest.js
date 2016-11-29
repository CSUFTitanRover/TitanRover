/* mobtest sends joystick values to the steermotors function*/

console.log('Loading');
var joystick = new (require('joystick'))(0, 3500, 350);
var steerMotors = require('diff-steer/motor_control');
var j5 = require('johnny-five');
var board = new j5.Board();
var bone = require('bonescript');

var lastX = 0;
var lastY = 0;

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var onJoystickData = function(event) {
    if(event.number === 0){
      console.log('X-AXIS');
      console.log(steerMotors(null, event.value.map(-3500, 3500, 0, 1), lastY));
      lastX = lastY = event.value.map(-3500, 3500, 0, 1);
    } 
    else{
      console.log('Y-AXIS');
      console.log(steerMotors(null, lastX, event.value.map(-3500, 3500, 0, 1)));
      lastY = event.value.map(-3500, 3500, 0, 1);
    }
};

joystick.on('axis', onJoystickData);

// TODO
//    1. Determine whether the speeds logged are logical
//    2. Declare J5 Motors & Test