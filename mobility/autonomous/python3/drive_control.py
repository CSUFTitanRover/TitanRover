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

#priming the motor forward to test
front_right.run(Adafruit_MotorHAT.FORWARD)
back_right.run(Adafruit_MotorHAT.FORWARD)
front_left.run(Adafruit_MotorHAT.FORWARD)
back_left.run(Adafruit_MotorHAT.FORWARD) 

def forwards():
    front_left.run(Adafruit_MotorHAT.FORWARD)
    back_left.run(Adafruit_MotorHAT.FORWARD)
    front_right.run(Adafruit_MotorHAT.FORWARD)
    back_right.run(Adafruit_MotorHAT.FORWARD)
    set_speed(100, 100) #added to see if directly setting the speed after is an issue
    
def backwards():
    front_left.run(Adafruit_MotorHAT.BACKWARD)
    back_left.run(Adafruit_MotorHAT.BACKWARD)
    front_right.run(Adafruit_MotorHAT.BACKWARD)
    back_right.run(Adafruit_MotorHAT.BACKWARD)
    
def left():
    front_left.run(Adafruit_MotorHAT.BACKWARD)
    back_left.run(Adafruit_MotorHAT.BACKWARD)
    front_right.run(Adafruit_MotorHAT.FORWARD)
    back_right.run(Adafruit_MotorHAT.FORWARD)

def right():
    front_left.run(Adafruit_MotorHAT.FORWARD)
    back_left.run(Adafruit_MotorHAT.FORWARD)
    front_right.run(Adafruit_MotorHAT.BACKWARD)
    back_right.run(Adafruit_MotorHAT.BACKWARD)

def stop():
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)

def set_speed(right_speed, left_speed):
    front_left.setSpeed(left_speed)
    back_left.setSpeed(left_speed)
    front_right.setSpeed(right_speed)
    back_right.setSpeed(right_speed)
    