import drive_control as dc
import time 
from time import sleep

servoMin = 1200 
servoMax = 4095


#dc.graceful_exit(signum,frame)
while (True):
    # Change speed of continuous servo on channel O
    print "Going forwards"
    for x in range(servoMin, servoMax):
        print("pwm value: ")
        print(x)
        dc.forwards(x)


    print "Full Speed Forward"
    time.sleep(5)

