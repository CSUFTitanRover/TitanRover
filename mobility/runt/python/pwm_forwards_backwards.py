from Adafruit_PWM_Servo_Driver import PWM
import time
import RPi.GPIO as GPIO
from time import sleep

'''
Runt Rover v.01
	Motor 1 - right side of the rover
	Moter 2 - left side of rover

	The script will run both pairs of motors for 2 seconds and stop.

'''
# Initialise the PWM device using the default address
pwm = PWM(0x40)

GPIO.setwarnings(False)

#Range is tested to work - Needs to be ironed out to exact values
servoMin = 800  # Min pulse length out of 4096
servoMax = 4095  # Max pulse length out of 4096

GPIO.setmode(GPIO.BOARD)

Motor1A = 36
Motor1B = 38

Motor2A = 12
Motor2B = 13

GPIO.setup(Motor1A,GPIO.OUT)
GPIO.setup(Motor1B,GPIO.OUT)

GPIO.setup(Motor2A,GPIO.OUT)
GPIO.setup(Motor2B,GPIO.OUT)

def forwards():
	GPIO.output(Motor1A,GPIO.HIGH)
	GPIO.output(Motor1B,GPIO.LOW)
	GPIO.output(Motor2A,GPIO.HIGH)
	GPIO.output(Motor2B,GPIO.LOW)

def backwards():
	GPIO.output(Motor1A,GPIO.LOW)
	GPIO.output(Motor1B,GPIO.HIGH)
	GPIO.output(Motor2A,GPIO.LOW)
	GPIO.output(Motor2B,GPIO.HIGH)

pwm.setPWMFreq(60)                        # Set frequency to 60 Hz

while (True):
	# Change speed of continuous servo on channel O
	print "Going forwards"
	forwards()
	for x in range (servoMin, servoMax):
		print (x)
		pwm.setPWM(0, 0, x)
		pwm.setPWM(1, 0, x)

	print "Full Speed Forward"
	time.sleep(2)

	for x in range (servoMin, servoMax):
		print (x)
		pwm.setPWM(0, 0, servoMax - x)
		pwm.setPWM(1, 0, servoMax - x)

	time.sleep(5)

	print "Going backwards"
	backwards()
	for x in range (servoMin, servoMax):
		print (x)
		pwm.setPWM(0, 0, x)
		pwm.setPWM(1, 0, x)

	print "Full Speed Backward"
	time.sleep(2)

	for x in range (servoMin, servoMax):
		print (x)
		pwm.setPWM(0, 0, servoMax - x)
		pwm.setPWM(1, 0, servoMax - x)

	time.sleep(5)

GPIO.cleanup()
