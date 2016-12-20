console.log('Loading mobility:');
const makePwmDriver = require('adafruit-i2c-pwm-driver');
const pwm = makePwmDriver({address: 0x40, device: '/dev/i2c-1', debug: false});

// Configure min and max servo pulse lengths
const servo_min = 204; // Calculated to be 1000 us
const servo_mid = 307; // Calculated to be 1500 us
const servo_max = 409; // Calculated to be 2000 us

const left_channel = 0;
const right_channel = 1;

pwm.setPWMFreq(50);

var joystick = new (require('joystick'))(0, 3500, 350);
var steerMotors = require('diff-steer/motor_control')

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
    setMotors(diffSteer[0], left_channel);
    setMotors(diffSteer[1], right_channel);
};

var setMotors = function(diffSteer, channel){
  if(diffSteer.direction === 'fwd'){
    //pwm.setPWMF(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_max)));
    console.log("fwd: " + parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_max)));
  }
  else{
    //pwm.setPWMF(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_min)));
    console.log("rev: " + parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_min)));
  }
};

joystick.on('axis', onJoystickData);
