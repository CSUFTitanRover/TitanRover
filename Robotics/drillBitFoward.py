import sys
import time
import RPi.GPIO as GPIO


GPIO.setmode(GPIO.BOARD)
mode=GPIO.getmode()
print " mode ="+str(mode)
GPIO.cleanup

forwardPin=16
sleeptime=10

GPIO.setup(forwardPin, GPIO.OUT)

GPIO.output(forwardPin, GPIO.HIGH)
print "Motor running forward"
time.sleep(sleeptime  )
GPIO.output(forwardPin, GPIO.LOW)
