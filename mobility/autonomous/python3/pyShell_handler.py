import drive_control as dc
import time
from time import sleep
import signal
import sys 

min_throttle = 1200 
max_throttle = 4095

signal.signal(signal.SIGINT, dc.sigint_handler)
move_direction = sys.argv[1]


if move_direction == 'f':
    dc.forwards(max_throttle)       

elif move_direction == 'l':
    
    dc.left()

elif move_direction == 'r':
    dc.right()

elif move_direction == 'b':
    dc.backwards()

elif move_direction == 'x':
    dc.set_speed(int(float(sys.argv[2])))

elif move_direction == 's':
    dc.stop()
