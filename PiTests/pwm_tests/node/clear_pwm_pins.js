const makePwmDriver = require('adafruit-i2c-pwm-driver')

const pwm = makePwmDriver({address: 0x40, device: '/dev/i2c-1', debug: false});
pwm.setPWM(15,4096,0);
