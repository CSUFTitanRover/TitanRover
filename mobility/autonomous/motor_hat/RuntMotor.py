#!/usr/bin/python

########## Code dependencies #######################################################
##  git clone https://github.com/adafruit/Adafruit-Motor-HAT-Python-Library.git
##  cd Adafruit-Motor-HAT-Python-Library
##  sudo apt-get install python-dev
##  sudo python setup.py install
####################################################################################

from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor

import time,sys,math
import atexit

# create a default object, no changes to I2C address or frequency
mh = Adafruit_MotorHAT(addr=0x60)

front_right = mh.getMotor(1)
back_right = mh.getMotor(2)
front_left = mh.getMotor(3) 
back_left = mh.getMotor(4)

# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
    #print('Motors stopped')
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)

front_right.run(Adafruit_MotorHAT.FORWARD)
back_right.run(Adafruit_MotorHAT.FORWARD)
front_left.run(Adafruit_MotorHAT.FORWARD)
back_left.run(Adafruit_MotorHAT.FORWARD) 

if int(sys.argv[1]) < 0:
    front_right.run(Adafruit_MotorHAT.BACKWARD)
    back_right.run(Adafruit_MotorHAT.BACKWARD)

if int(sys.argv[2]) < 0:
    front_left.run(Adafruit_MotorHAT.BACKWARD)
    back_left.run(Adafruit_MotorHAT.BACKWARD)    
    
if int(sys.argv[1]) == 0 and int(sys.argv[2]) == 0:
    atexit.register(turnOffMotors)
else:
####### runt motors run!#########
   #####Right Side######

    front_right.setSpeed(abs(int(sys.argv[1])));
    back_right.setSpeed(abs(int(sys.argv[1])));

   #####Left Side######
    front_left.setSpeed(abs(int(sys.argv[2])));
    back_left.setSpeed(abs(int(sys.argv[2])));

    #Text output for testing code
    #print('right side power ' + sys.argv[1] + ' left side power ' + sys.argv[2])
    #sys.stdout.flush()