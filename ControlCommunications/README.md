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
The GPIO pins used on the PI are the actual pins not names of pins  


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

## Pins in use  
We are using both a raspberry pi and arduino to drive the stepper motors for the arm.  
The raspberry pi will be sending the on/off command to the arduino through serial transfer.

#### Raspberry Pi pins  
*Joint1*  
GPIO: 17 Direction - Actual pin: 11  
GPIO: 27 Enable - Actual pin: 13  

*Joint4*  
GPIO: 12 Direction - Actual pin: 32  
GPIO: 16 Enable - Actual pin: 36  

*Joint5*  
GPIO: 22 Direction - Actual pin: 15  
GPIO: 24 Enable - Actual pin: 18  

*Joint6*  
GPIO: 18 Direction - Actual pin: 12  

#### Arduino pins  
*Joint1*  
Digital: 8 Pulse for stepper  

*Joint4*  
Digital: 9 Pulse for stepper  

*Joint5*  
Digital: 10 Pulse for stepper  

*Joint6*  
Digital: 7 Pulse for stepper  
Slave Select: 3 Used to select which stepper motor we are using  

*All Pololu Motors*  
MOSI: 11 Master Out Slave In  
MISO: 12 Master In Slave Out  
SCK: 13 Clock to Synchronize data transfer  

## Problems we faced  
We first tried getting the pi to generate the GPIO signals needed to drive the stepper motors, but it wasn't fast enough.  
So we then tried using PWM and set it to its full high over its duty cycle, this seemed to make things worse not better.
We are now using two controllers a PI to handle the dir and enab pins while the arduino drives the puls needed to move the stepper motor.
We now need to see about going through serial to tell the arduino which motor to operate instead of a on/off pin.  
After transfering to serial communication to the arduino if the raspberry pi restarts with the arduino plugged in the raspberry pi can't see its serial connection STILL NEED to FIX.
