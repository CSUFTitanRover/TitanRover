const makePwmDriver = require('adafruit-i2c-pwm-driver')// use this one in real use case
const sleep = require('sleep').sleep

const pwm = makePwmDriver({address: 0x40, device: '/dev/i2c-1', debug: false})

// Configure min and max servo pulse lengths
const servo_min = 204 // Calculated to be 1000 us
const servo_mid = 307 // Calculated to be 1500 us
const servo_max = 409 // Calculated to be 2000 us

pwm.setPWMFreq(50)

setInterval (function () {
pwm.setPWM(0, 0, servo_min);
sleep(1);
pwm.setPWM(0, 0, servo_mid);
sleep(1);
pwm.setPWM(0, 0, servo_max);	
}, 2000);
