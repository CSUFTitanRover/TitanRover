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



####### runt motors run!#########
   #####Right Side######
print('throttle val: ' + sys.argv[1])

front_right.setSpeed(abs(int(sys.argv[1])));
back_right.setSpeed(abs(int(sys.argv[1])));

#####Left Side######
front_left.setSpeed(abs(int(sys.argv[2])));
back_left.setSpeed(abs(int(sys.argv[2])));