import RPi.GPIO as GPIO
from time import sleep

''' 
Runt Rover v.01 
	Motor 1 - right side of the rover
	Moter 2 - left side of rover

	The script will run both pairs of motors for 2 seconds and stop. 
	 
'''  
GPIO.setmode(GPIO.BOARD)
 
Motor1A = 36
Motor1B = 38
Motor1E = 40

Motor2A = 37
Motor2B = 35
Motor2E = 33
 
GPIO.setup(Motor1A,GPIO.OUT)
GPIO.setup(Motor1B,GPIO.OUT)
GPIO.setup(Motor1E,GPIO.OUT)

GPIO.setup(Motor2A,GPIO.OUT)
GPIO.setup(Motor2B,GPIO.OUT)
GPIO.setup(Motor2E,GPIO.OUT) 

print "Turning motor on"
GPIO.output(Motor1A,GPIO.HIGH)
GPIO.output(Motor1B,GPIO.LOW)
GPIO.output(Motor1E,GPIO.HIGH)

GPIO.output(Motor2A,GPIO.HIGH)
GPIO.output(Motor2B,GPIO.LOW)
GPIO.output(Motor2E,GPIO.HIGH)
 
sleep(2)
 
print "Stopping motor"
GPIO.output(Motor1E,GPIO.LOW)
GPIO.output(Motor2E,GPIO.LOW) 
GPIO.cleanup()
