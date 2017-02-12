#Control Communications  
The rover is being controlled using a Logitech 3d pro joystick controller.  
This joystick controller will be JSON.stringify() to send over the network to the rover control to be parsed an relayed to its handler function.  The rover will be hosting a UDP server that will be accepting input from the HomebaseControl.js process.  The HomebaseControl.js process will also be hosting a UDP server that handles Connection information between the rover and the homebase station.  The rover should stop operating when it loses connection.  

#To operate the control  
1. Plug joystick into linux computer
2. Run the Control handler for the Homebase  ```node HomebaseControl.js```
3. The RoverControl.js should be running on boot if it is not run  ```node RoverControl.js```  

## Important information  
HomebaseControl is running on port 5000  
RoverControl    is running on port 3000


##Joystick Output Mapping  
Buttons:    These values are either 1(pressed) or 0(unpressed)
number = 0: Trigger
number = 1: Thump button: Switch from Mobility mode to Arm mode
number = 2: Button 3
number = 3: Button 4
number = 4: Button 5
number = 5: Button 6
number = 6: Button 7
number = 7: Button 8
number = 8: Button 9
number = 9: Button 10
number = 10: Button 11
number = 11: Button 12

Axis:
number = 0: X Axis Mobility
number = 1: Y Axis Mobility
number = 2:
number = 3: Throttle For the Mobility
number = 4:
number = 5:
