#!/usr/bin/python

########## Code dependencies #######################################################
##  git clone https://github.com/adafruit/Adafruit-Motor-HAT-Python-Library.git
##  cd Adafruit-Motor-HAT-Python-Library
##  sudo apt-get install python-dev
##  sudo python setup.py install
####################################################################################

from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor


import sys

# create a default object, no changes to I2C address or frequency
mh = Adafruit_MotorHAT(addr=0x60)

front_right = mh.getMotor(1)
back_right = mh.getMotor(2)
front_left = mh.getMotor(3) 
back_left = mh.getMotor(4)

while(true):
    if sys.argv[1] ==  'F':
        print 'inside f'
        front_right.run(Adafruit_MotorHAT.FORWARD)
        back_right.run(Adafruit_MotorHAT.FORWARD)
        front_left.run(Adafruit_MotorHAT.FORWARD)
        back_left.run(Adafruit_MotorHAT.FORWARD) 

        front_right.setSpeed(100);
        back_right.setSpeed(100);

        front_left.setSpeed(100);
        back_left.setSpeed(100);

    if sys.argv[1] ==  'B':
        front_right.run(Adafruit_MotorHAT.BACKWARD)
        back_right.run(Adafruit_MotorHAT.BACKWARD)
        front_left.run(Adafruit_MotorHAT.BACKWARD)
        back_left.run(Adafruit_MotorHAT.BACKWARD) 


    if sys.argv[1] ==  'R':
        front_right.run(Adafruit_MotorHAT.BACKWARD)
        back_right.run(Adafruit_MotorHAT.BACKWARD)
        front_left.run(Adafruit_MotorHAT.FORWARD)
        back_left.run(Adafruit_MotorHAT.FORWARD)


    if sys.argv[1] ==  'L':
        front_right.run(Adafruit_MotorHAT.FORWARD)
        back_right.run(Adafruit_MotorHAT.FORWARD)
        front_left.run(Adafruit_MotorHAT.BACKWARD)
        back_left.run(Adafruit_MotorHAT.BACKWARD)
        
    

    #Text output for testing code
    #print('right side power ' + sys.argv[1] + ' left side power ' + sys.argv[2])
    #sys.stdout.flush()
