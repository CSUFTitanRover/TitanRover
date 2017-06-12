import sys
import drive_control as dc
import json

throttle = json.loads(sys.argv[1])

dc.set_left_motors(throttle.leftSpeed)
dc.set_right_motors(throttle.rightSpeed)

