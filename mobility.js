console.log('Loading mobility:');

// PWM Config for Pi Hat:
const makePwmDriver = require('adafruit-i2c-pwm-driver');
const pwm = makePwmDriver({
    address: 0x40,
    device: '/dev/i2c-1',
    debug: false
});

// Based on J. Stewart's calculations:
// Values for Sabertooth 2X60:
//    1000 = Full Reverse
//    1500 = Stopped
//    2000 = Full Forward.
const servo_min = 204; // Calculated to be 1000 us
const servo_mid = 307; // Calculated to be 1500 us
const servo_max = 409; // Calculated to be 2000 us

// PWM Channel Config:
const left_channel = 0;
const right_channel = 1;

// Based on J. Stewart's calculations:
pwm.setPWMFreq(50);

// NPM Library for USB Logitech Extreme 3D Pro Joystick input:
//    See: https://titanrover.slack.com/files/joseph_porter/F2DS4GBUM/Got_joystick_working_here_is_the_code.js
//    Docs: https://www.npmjs.com/package/joystick
var joystick = new(require('joystick'))(0, 3500, 350);

// NPM Differential Steering Library: 
//    Docs: https://www.npmjs.com/package/diff-steer
var steerMotors = require('diff-steer/motor_control');

// Global Variables to Keep Track of Asynchronous Translated
//    Coordinate Assignment
var lastX = 0;
var lastY = 0;

/**
 * Prototype function.  Map values from range in_min -> in_max to out_min -> out_max
 * @param {Number} in_min 
 * @param {Number} in_max
 * @param {Number} out_min 
 * @param {Number} out_max
 * @return {Number} An unnamed value described in range out_min -> out_max
 */
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

/**
 * Function called on axis change from Joystick.  This function only responds to changes on X or Y, 
 number 0 or 1 respectively.  (1) Gets changed joystick value per X or Y Axis, (3) Calculate 
 differential steering by mappng joystick range to diff-steer range and stores the result in 
 lastX or last Y depending on axis changed, (4) Send values with proper channels to send values
 to motors. 
 * @param {Event} event.  Describes number, value, where number is axis and value is joystick value
 */
var onJoystickData = function(event) {
    // X-Axis
    if (event.number === 0) {
        diffSteer = steerMotors(null, event.value.map(-35000, 35000, -1, 1), lastY);
        lastX = event.value.map(-35000, 35000, -1, 1);
    }
    // Y-Axis
    else if (event.number == 1) {
        diffSteer = steerMotors(null, lastX, event.value.map(-35000, 35000, -1, 1));
        lastY = event.value.map(-35000, 35000, -1, 1);
    }
    console.log(diffSteer);
    setMotors(diffSteer[0], left_channel);
    setMotors(diffSteer[1], right_channel);
};

/**
 * Function called on axis change from Joystick.  This function only responds to changes on X or Y, 
 number 0 or 1 respectively.  (1) Gets changed joystick value per X or Y Axis, (3) Calculate 
 differential steering by mappng joystick range to diff-steer range and stores the result in 
 lastX or last Y depending on axis changed, (4) Send values with proper channels to send values
 to motors.
  * @param {Int} channel.  Value described by left_channel or right_channel corresponding to pin outs
 * @param {JSON} diffSteer.  Differntial steering calculations for one side described by channel
 */
var setMotors = function(diffSteer, channel) {
    if (diffSteer.direction === 'fwd') {
        //pwm.setPWMF(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_max)));
        console.log(">>fwd: " + parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_max)));
    } else {
        //pwm.setPWMF(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_min)));
        console.log(">>rev: " + parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_min)));
    }
};

joystick.on('axis', onJoystickData);