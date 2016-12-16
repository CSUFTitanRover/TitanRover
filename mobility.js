console.log('Loading joystick mobility:');
var joystick = new (require('joystick'))(0, 3500, 350);
var steerMotors = require('diff-steer/motor_control');
var j5 = require('johnny-five');
 
var lastX = 0;
var lastY = 0;
 
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
 
var onJoystickData = function(event) {
    if(event.number === 0){
      diffSteer = steerMotors(null, event.value.map(-35000, 35000, -1, 1), lastY);
      lastX = lastY = event.value.map(-35000, 35000, -1, 1);
    }
    else if (event.number == 1){
      diffSteer = steerMotors(null, lastX, event.value.map(-35000, 35000, -1, 1));
      lastY = event.value.map(-35000, 35000, -1, 1);
    }
    console.log(diffSteer);
};
 
joystick.on('axis', onJoystickData);
