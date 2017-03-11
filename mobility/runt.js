const makePwmDriver = require('adafruit-i2c-pwm-driver');
const gpio = require('rpi-gpio');

// MOTOR Initialization
const MOTOR1A = 36;
const MOTOR1B = 38;
const MOTOR2A = 12;
const MOTOR2B = 13;

const motor_minPWM = 1100; // Stop speed
const motor_maxPWM = 4095; // Full throttle
gpio.setup(MOTOR1A, gpio.DIR_OUT);
gpio.setup(MOTOR1B, gpio.DIR_OUT);
gpio.setup(MOTOR2A, gpio.DIR_OUT);
gpio.setup(MOTOR2B, gpio.DIR_OUT);

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
        GPIO.write(MOTOR1A, GPIO.HIGH);
        GPIO.write(MOTOR1B, GPIO.LOW);
        GPIO.write(MOTOR2A, GPIO.HIGH);
        GPIO.write(MOTOR2B, GPIO.LOW);
        pwm.setPWM(0, 0, parseInt(throttle));
        pwm.setPWM(1, 0, parseInt(throttle));
    },
    stop: function(){
        pwm.setPWM(0, 0, 0);
        pwm.setPWM(1, 0, 0);
    },
    turn_right: function(throttle){
        GPIO.write(MOTOR1A, GPIO.LOW);
        GPIO.write(MOTOR1B, GPIO.HIGH);
        GPIO.write(MOTOR2A, GPIO.HIGH);
        GPIO.write(MOTOR2B, GPIO.LOW);
        pwm.setPWM(0, 0, parseInt(throttle));
        pwm.setPWM(1, 0, parseInt(throttle));
    },
    turn_left: function(throttle){
        GPIO.write(MOTOR1A, GPIO.HIGH);
        GPIO.write(MOTOR1B, GPIO.LOW);
        GPIO.write(MOTOR2A, GPIO.LOW);
        GPIO.write(MOTOR2B, GPIO.HIGH);
        pwm.setPWM(0, 0, parseInt(throttle));
        pwm.setPWM(1, 0, parseInt(throttle));
    },
    cleanup: function(){
        pwm.setPWM(0, 0, 0);
        pwm.setPWM(1, 0, 0);
        gpio.destroy(function() {
            console.log('All pins unexported');
        });
    }
};