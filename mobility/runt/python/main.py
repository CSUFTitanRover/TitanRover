import drive_control as dc
import time 
from time import sleep

servoMin = 800
servoMax = 1400

while (True):
    # Change speed of continuous servo on channel O
    print "Going forwards"
    for x in range(servoMin, servoMax):
        dc.forwards(x)

    print "Full Speed Forward"
    time.sleep(2)

    for x in range(servoMin, servoMax):
        print (x)
        dc.forwards(servoMax-x)

    time.sleep(5)

    print "Going backwards"

    for x in range(servoMin, servoMax):
        dc.backwards(x)

    print "Full Speed Backward"
    time.sleep(2)

    for x in range(servoMin, servoMax):
      dc.backwards(servoMax-x)

    time.sleep(5)