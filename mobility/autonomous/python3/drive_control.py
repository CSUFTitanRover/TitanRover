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

# Right side of rover
MOTOR1A = 36
MOTOR1B = 38

# Left side of rover 
MOTOR2A = 12
MOTOR2B = 13

GPIO.setup(MOTOR1A, GPIO.OUT)
GPIO.setup(MOTOR1B, GPIO.OUT)

GPIO.setup(MOTOR2A, GPIO.OUT)
GPIO.setup(MOTOR2B, GPIO.OUT)



    
def forwards():
    
    GPIO.output(MOTOR1A, GPIO.HIGH)
    GPIO.output(MOTOR1B, GPIO.LOW)
    GPIO.output(MOTOR2A, GPIO.HIGH)
    GPIO.output(MOTOR2B, GPIO.LOW)
    
    

def backwards(x):
    
    GPIO.output(MOTOR1A, GPIO.LOW)
    GPIO.output(MOTOR1B, GPIO.HIGH)
    GPIO.output(MOTOR2A, GPIO.LOW)
    GPIO.output(MOTOR2B, GPIO.HIGH)
    pwm.setPWM(0, 0, x)
    pwm.setPWM(1, 0, x)

'''Right and left functions will probably need separate
    pwm values'''

def left():
    print 'turning left py'
    GPIO.output(MOTOR1A, GPIO.LOW)
    GPIO.output(MOTOR1B, GPIO.HIGH)
    GPIO.output(MOTOR2A, GPIO.HIGH)
    GPIO.output(MOTOR2B, GPIO.LOW)
    pwm.setPWM(0, 0,2500 )
    pwm.setPWM(1, 0, 2500)

def right():
    print 'turning right py'
    GPIO.output(MOTOR1A, GPIO.HIGH)
    GPIO.output(MOTOR1B, GPIO.LOW)
    GPIO.output(MOTOR2A, GPIO.LOW)
    GPIO.output(MOTOR2B, GPIO.HIGH)
    pwm.setPWM(0, 0, 2500)
    pwm.setPWM(1, 0, 2500)              

def stop():
    print "stopping"
    pwm.setPWM(0, 0, 0)
    pwm.setPWM(1, 0, 0)
    GPIO.cleanup()

def set_speed(throttle):
    print 'setting set_speed'      
    pwm.setPWM(0, 0, throttle)
    pwm.setPWM(1, 0, throttle)

def sigint_handler(signum, frame):
    print "Exiting with cleanup"
    pwm.setPWM(0, 0, 0)
    pwm.setPWM(1, 0, 0)
    GPIO.cleanup()
    sys.exit(0)

def shutdown(signum, frame):
    print "Exiting with cleanup"
    pwm.setPWM(0, 0, 0)
    pwm.setPWM(1, 0, 0)
    GPIO.cleanup()
    sys.exit(0)

