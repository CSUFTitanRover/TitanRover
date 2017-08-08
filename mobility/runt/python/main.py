import drive_control as dc
import time
from time import sleep
import signal

print "Enter command left(l), right(r), forwards(f), backwards(b), stop(s)"
dc.set_speed(150,150)
while True:        
    move_direction = raw_input("Enter command: ")
    if move_direction == 'f':
        dc.forwards()

    elif move_direction == 'l':
        dc.left()

    elif move_direction == 'r':
        dc.right()

    elif move_direction == 'b':
        dc.backwards()
    
    elif move_direction == 's':
        dc.stop()
