# Control Communications  
### Can be controled in two ways with the Logitech Joysticks or dualshock-controller.  
 It is parsed and relayed to its handler function.  The rover hosts a UDP server accepts input from the HomebaseControl.js process. HomebaseControl also hosts a UDP server that handles Connection information between the rover and homebase station.  The rover will stop operating when it loses connection.  

## To operate the control  
1. Plug joystick into the computer
2. Run the Control handler for the Homebase  ```node [The joystick you want]_Homebase.js```
3. The RoverControl.js should be running on boot if it is not run  ```node RoverControl.js```  

#### Joystick_Homebase.js accepts 4 arguments
1. both - Will need both joysticks plugged in  
2. mobility - Will need one joystick for mobility control  
3. arm - Will need one joystick for arm control  
4. none - No joysticks needed used for testing purposes  

```node Joystick_Homebase.js [both|mobility|arm|none]```  
If left blank will run in default both joysticks  

## Important information  
HomebaseControl is running on port 5000  
RoverControl    is running on port 3000  
The GPIO pins used on the PI are the actual pins not names of pins  

## Logitech Joysticks
Buttons:    These values are either 1(pressed) or 0(unpressed)  
number = 0: Trigger  
number = 1: Thump button  
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
number = 0: X of big joystick value between -32767 and 32767  
number = 1: Y of big joystick value between -32767 and 32767  
number = 2: Twist of big joystick value between -32767 and 32767  
number = 3: Throttle on bottom value between -32767 and 32767  
number = 4: X top of joystick value is either -32767 left or 32767 right  
number = 5: Y top of joystick value is either -32767 up or 32767 down  

## Joystick Dualshock  
The left joystick is for drive control. Float values between -1 and 1.

The arm uses the Dpad for the rotating base and the last limb. The right joystick is used for limbs 1 and 2 with inverse kinematics.

Full Mapping in the Doc!

https://docs.google.com/document/d/1WDijduTZjryv08eI5N0dVvTw98pcXWOBMx0P8Qr28a8/edit?usp=sharing

## Problems we faced  
- We first tried getting the pi to generate the GPIO signals needed to drive the stepper motors, but it wasn't fast enough.  
- So we then tried using PWM and set it to its full high over its duty cycle, this seemed to make things worse not better.
- We are now using two controllers a PI to handle the dir and enab pins while the arduino drives the puls needed to move the stepper motor.
We now need to see about going through serial to tell the arduino which motor to operate instead of a on/off pin.  
- After transfering to serial communication to the arduino if the raspberry pi restarts with the arduino plugged in the raspberry pi can't see its serial connection STILL NEED to FIX.
- We have changed our control to use the Pi as the master and the Arduino as the slave.
