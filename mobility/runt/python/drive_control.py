from Adafruit_PWM_Servo_Driver import PWM
import RPi.GPIO as GPIO
import sys

'''
Runt Rover v.01
	Motor 1 - right side of the rover
	Moter 2 - left side of rover

	The script will run both pairs of motors for 2 seconds and stop.

'''
# Initialise the PWM device using the default address
pwm = PWM(0x40)
pwm.setPWMFreq(50) 


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

Motor1A = 36
Motor1B = 38

Motor2A = 12
Motor2B = 13

GPIO.setup(Motor1A, GPIO.OUT)
GPIO.setup(Motor1B, GPIO.OUT)

GPIO.setup(Motor2A, GPIO.OUT)
GPIO.setup(Motor2B, GPIO.OUT)


def forwards(x):
    print "moving forwards" 
    GPIO.output(Motor1A, GPIO.HIGH)
    GPIO.output(Motor1B, GPIO.LOW)
    GPIO.output(Motor2A, GPIO.HIGH)
    GPIO.output(Motor2B, GPIO.LOW)
    pwm.setPWM(0, 0, x)
    pwm.setPWM(1, 0, x)

def backwards(x):
    print "moving backwards"
    GPIO.output(Motor1A, GPIO.LOW)
    GPIO.output(Motor1B, GPIO.HIGH)
    GPIO.output(Motor2A, GPIO.LOW)
    GPIO.output(Motor2B, GPIO.HIGH)
    pwm.setPWM(0, 0, x)
    pwm.setPWM(1, 0, x)

'''Right and left functions will probably need separate
    pwm values'''

def right(x):
    print "moving right"
    GPIO.output(Motor1A, GPIO.LOW)
    GPIO.output(Motor1B, GPIO.HIGH)
    GPIO.output(Motor2A, GPIO.HIGH)
    GPIO.output(Motor2B, GPIO.LOW)
    pwm.setPWM(0, 0, x)
    pwm.setPWM(1, 0, x)

def left(x):
    print "moving left"
    GPIO.output(Motor1A, GPIO.HIGH)
    GPIO.output(Motor1B, GPIO.LOW)
    GPIO.output(Motor2A, GPIO.LOW)
    GPIO.output(Motor2B, GPIO.HIGH)
    pwm.setPWM(0, 0, x)
    pwm.setPWM(1, 0, x)               # Set frequency to 60 H

def stop():
    print "stopping"
    pwm.setPWM(0,0,0)
    pwm.setPWM(1,0,0)
    
def sigint_handler(signum, frame):
    print "Exiting with cleanup"
    pwm.setPWM(0,0,0)
    pwm.setPWM(1,0,0)
    GPIO.cleanup()
    sys.exit(0)
