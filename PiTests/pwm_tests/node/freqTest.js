const makePwmDriver = require('adafruit-i2c-pwm-driver')// use this one in real use case
const sleep = require('sleep').sleep


const pwm = makePwmDriver({address: 0x40, device: '/dev/i2c-1', debug: false});


pwm.setPWMFreq(400);

var count = 0; 
pwm.setPWM(15);
