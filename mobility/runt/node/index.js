const makePwmDriver = require('adafruit-i2c-pwm-driver')
const pwmDriver = makePwmDriver({address: 0x40, device: '/dev/i2c-1'})

pwmDriver.setPWMFreq(50)
pwmDriver.setPWM(2,0,120)
