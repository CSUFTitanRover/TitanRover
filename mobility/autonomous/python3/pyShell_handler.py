import drive_control as dc
import time
from time import sleep
import signal
import sys 

signal.signal(signal.SIGINT, dc.sigint_handler)
move_direction = sys.argv[1]

if move_direction == 'f':
    dc.forwards()
    dc.set_speed(255, 255)      

elif move_direction == 'l':
    dc.left()
    dc.set_speed(255 , 255)

elif move_direction == 'r':
    dc.right()
    dc.set_speed(255 , 255)

elif move_direction == 'b':
    dc.backwards()
    dc.set_speed(255 , 255)

elif move_direction == 'x':
    dc.set_speed(int(float(sys.argv[2])),int(float(sys.argv[3])))

elif move_direction == 's':
    dc.stop()
