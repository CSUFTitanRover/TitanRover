#!/usr/bin/python

# 1 - top right. 2- bottom right. 3- top left, 4- bottom -left 
from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor

import time
import atexit

# create a default object, no changes to I2C address or frequency
mh = Adafruit_MotorHAT(addr=0x60)

# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)
   

atexit.register(turnOffMotors)

front_right = mh.getMotor(1)
back_right = mh.getMotor(2)
front_left = mh.getMotor(3) 
back_left = mh.getMotor(4)


# set the speed to start, from 0 (off) to 255 (max speed)
# front_right.setSpeed(150)
# front_left.setSpeed(150)
# back_right.setSpeed(150)
# back_left.setSpeed(150)

while (True):
    print "Forward! "
    front_right.run(Adafruit_MotorHAT.FORWARD)
    front_left.run(Adafruit_MotorHAT.FORWARD)
    back_right.run(Adafruit_MotorHAT.FORWARD)
    back_left.run(Adafruit_MotorHAT.FORWARD)

    print "\tSpeed up..."
    for i in range(255):
        front_right.setSpeed(i)
        front_left.setSpeed(i)
        back_right.setSpeed(i)
        back_left.setSpeed(i)
        time.sleep(0.01)

    print "\tSlow down..."
    for i in reversed(range(255)):
        front_right.setSpeed(i)
        front_left.setSpeed(i)
        back_right.setSpeed(i)
        back_left.setSpeed(i)
        time.sleep(0.01)

    print "Backward! "
    front_right.run(Adafruit_MotorHAT.BACKWARD)
    front_left.run(Adafruit_MotorHAT.BACKWARD)
    back_right.run(Adafruit_MotorHAT.BACKWARD)
    back_left.run(Adafruit_MotorHAT.BACKWARD)


    print "\tSpeed up..."
    for i in range(255):
        front_right.setSpeed(i)
        front_left.setSpeed(i)
        back_right.setSpeed(i)
        back_left.setSpeed(i)
        time.sleep(0.01)

    print "\tSlow down..."
    for i in reversed(range(255)):
        front_right.setSpeed(i)
        front_left.setSpeed(i)
        back_right.setSpeed(i)
        back_left.setSpeed(i)
        time.sleep(0.01)

    print "Release"
    front_right.run(Adafruit_MotorHAT.RELEASE)
    front_left.run(Adafruit_MotorHAT.RELEASE)
    time.sleep(1.0)