const makePwmDriver = require('adafruit-i2c-pwm-driver');
const GPIO = require('rpi-gpio');

// MOTOR Initialization
const MOTOR1A = 36;
const MOTOR1B = 38;
const MOTOR2A = 12;
const MOTOR2B = 13;

const motor_minPWM = 1100; // Stop speed
const motor_maxPWM = 4095; // Full throttle
GPIO.setup(MOTOR1A, GPIO.DIR_OUT);
GPIO.setup(MOTOR1B, GPIO.DIR_OUT);
GPIO.setup(MOTOR2A, GPIO.DIR_OUT);
GPIO.setup(MOTOR2B, GPIO.DIR_OUT);

// PWM Config for Pi Hat:
const pwm = makePwmDriver({
    address: 0x40,
    device: '/dev/i2c-1',
    debug: false
});
 
 /* 
        pwm.setPWM(0, 0, parseInt(speed)); - LEFT MOTOR
        pwm.setPWM(1, 0, parseInt(speed)); - RIGHT MOTOR 
 */
module.exports = {


    forward: function(throttle){
        GPIO.write(MOTOR1A, true);
        GPIO.write(MOTOR1B, false);
        GPIO.write(MOTOR2A, true);
        GPIO.write(MOTOR2B, false);
        pwm.setPWM(0, 0, parseInt(throttle));
        pwm.setPWM(1, 0, parseInt(throttle));
    },
    stop: function(){
        pwm.setPWM(0, 0, 0);
        pwm.setPWM(1, 0, 0);
    },
    turn_right: function(throttle){
        GPIO.write(MOTOR1A, false);
        GPIO.write(MOTOR1B, true);
        GPIO.write(MOTOR2A, true);
        GPIO.write(MOTOR2B, false);
        pwm.setPWM(0, 0, parseInt(throttle));
        pwm.setPWM(1, 0, parseInt(throttle));
    },
    turn_left: function(throttle){
        GPIO.write(MOTOR1A, true);
        GPIO.write(MOTOR1B, false);
        GPIO.write(MOTOR2A, false);
        GPIO.write(MOTOR2B, true);
        pwm.setPWM(0, 0, parseInt(throttle));
        pwm.setPWM(1, 0, parseInt(throttle));
    },
    cleanup: function(){
        pwm.setPWM(0, 0, 0);
        pwm.setPWM(1, 0, 0);
        GPIO.destroy(function() {
            console.log('All pins unexported');
        });
    }
};
