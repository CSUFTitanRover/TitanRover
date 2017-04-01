import drive_control as dc
import time
from time import sleep
import signal
import sys 

min_throttle = 1200 
max_throttle = 4095

signal.signal(signal.SIGINT, dc.sigint_handler)
move_direction = sys.argv[1]
print "Enter command left(l), right(r), forwards(f), backwards(b), stop(s)"

if move_direction == 'f':
    dc.forwards(max_throttle)

elif move_direction == 'l':
    dc.left(max_throttle)

elif move_direction == 'r':
    dc.right(max_throttle)

elif move_direction == 'b':
    dc.backwards(max_throttle)

elif move_direction == 's':
    dc.stop()
