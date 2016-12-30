# Mobility Testing (Most Recent First)

Name: Joe Edwards and Justin Stewart
Date: 12/19/2016
Year: master2017
Subsystem: administration
Status: alpha

Reference Links: 
[node.js Adafruit i2c PWM Driver](https://github.com/kaosat-dev/adafruit-i2c-pwm-driver)
[Adafruit PWM Library Reference](https://learn.adafruit.com/adafruit-16-channel-pwm-servo-hat-for-raspberry-pi/library-reference)


Information:

Implemented the differential steering code Joe E. had ported from last years rover. Changed primary control from
Taranis RC control via PWM to USB joystick. Was able to achieve control of motors via USB joystick by mapping the values
that were output from the USB to appropriate PWM outputs. However, calculation of zero throttle point (1500 microseconds) 
was a little off and needed to be adjusted by a small amount. 

Research: 

Used references mentioned above to achieve success of drive system. Needed a way to calculate appropriate PWM signals to send.

Next Steps:

Implement USB joystick send/receive server in order to send control signals over network, as opposed to direct USB connection
tested today. Find why PWM signal was calculated incorrectly and find more accurate way to calculate. 

