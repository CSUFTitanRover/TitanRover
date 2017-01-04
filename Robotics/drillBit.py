import sys
import time
import RPi.GPIO as GPIO


GPIO.setmode(GPIO.BCM)
mode=GPIO.getmode()
print " mode ="+str(mode)
GPIO.cleanup
