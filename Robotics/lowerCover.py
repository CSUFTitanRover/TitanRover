#Created by Brandon Hawkinson
#Use for TitanRover Science Cache
#Created on 11/23/16

import time
import wiringpi

#sets up GPIO
wiringpi.wiringPiSetupGpio()

#enables GPIO18 pin to be an output
wiringpi.pinMode(18, wiringpi.GPIO.PWM_OUTPUT)

#Enables PWM on GPIO18 pin
wiringpi.pwmSetMode(wiringpi.GPIO.PWM_MODE_MS)

#Setting our clocks and PWM pulse range
wiringpi.pwmSetClock(192)
wiringpi.pwmSetRange(2000)

#sets a delay variable to be used in our function
delay_period = 0.01

#loops through the range of the SG90
for pulse in range(250,100,-1):
	#send a pulse in pin 18 and delay slightly to let the servo execute
        wiringpi.pwmWrite(18, pulse)
        time.sleep(delay_period)

