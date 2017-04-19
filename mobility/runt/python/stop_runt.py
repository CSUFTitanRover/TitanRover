#!/usr/bin/python
from Adafruit_PWM_Servo_Driver import PWM
import time
import RPi.GPIO as GPIO
from time import sleep


pwm=PWM(0x40)
pwm.setPWMFreq(50)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

# Setting pwm to 0 values
pwm.setPWM(1,0,0)
pwm.setPWM(0,0,0)
GPIO.cleanup()
