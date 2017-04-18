import drive_control as dc
import time
from time import sleep
import signal
import sys 

move_direction = sys.argv[1]

print(sys.argv[1])
print(sys.argv[2])
print(sys.argv[3])

if move_direction == 'f':
    dc.forwards()  

elif move_direction == 'l':
    dc.left()

elif move_direction == 'r':
    dc.right()

elif move_direction == 'b':
    dc.backwards()

elif move_direction == 'x':
    dc.set_speed(int(sys.argv[2]),int(sys.argv[3]))

elif move_direction == 's':
    dc.stop()
