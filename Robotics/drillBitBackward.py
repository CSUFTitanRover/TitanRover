import sys
import time
import RPi.GPIO as GPIO


GPIO.setmode(GPIO.BOARD)
mode=GPIO.getmode()
print " mode ="+str(mode)
GPIO.cleanup

backwardPin=18
sleeptime=10

GPIO,setup(backwardPin, GPIO.OUT)

GPIO.output(backwardPin, GPIO.HIGH)
print "Motor running backward"
time.sleep(sleeptime)
GPIO.output(backwardPin, GPIO.LOW)
