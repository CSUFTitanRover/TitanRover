import drive_control as dc
import time
from time import sleep
import signal

min_throttle = 1200 
max_throttle = 4095

    
signal.signal(signal.SIGINT, dc.sigint_handler)

print "Enter command left(l), right(r), forwards(f), backwards(b), stop(s)"
while True:        
    move_direction = raw_input("Enter command: ")
    if move_direction == 'f':
        dc.forwards(max_throttle/3)

    elif move_direction == 'l':
        dc.left(max_throttle/3)

    elif move_direction == 'r':
        dc.right(max_throttle/3)

    elif move_direction == 'b':
        dc.backwards(max_throttle/3)
    
    elif move_direction == 's':
        dc.stop()
