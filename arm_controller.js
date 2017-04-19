/*
  Author: Shan Liyanage and Joseph Porter
  Titan Rover - Linear Actuator controller 
  Description: 
    
    Controlling a linear actuator with a joystick. 
    
    Potentiometer values will be displayed graphically on a 
    separate web page in real time
*/

var joystick = new (require('joystick'))(0, 3500, 350);
var five = require("johnny-five");
var BeagleBone = require("beaglebone-io");

var board = new five.Board({
    io: new BeagleBone()
});

joystick.on('button', onJoystickData);
joystick.on('axis', onJoystickData);

board.on("ready", function() {
    
        // Initializing linear actuator pins 
        var linear1_pin1 = new five.Pin(10);    // Need to map all these to correct beaglebone pins
        var linear1_pin2 = new five.Pin(11);
        var linear2_pin1 = new five.Pin(12);
        var linear2_pin2 = new five.Pin(13);
        console.log("Starting to read events!!!!");

        // Todo: Use joystick data here
        
        /* =========== Layout of joystick =============
        
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
            ==================================================  */
        function onJoystickData(event) {

            if (event.type == "axis")
            {
                if (event.number == 0)  // Move x axis to move lower actuator
                {
                    if (event.value > 0)
                    {
                        linear1_pin1.low();
                        linear1_pin2.high();
                    }
                    else if (event.value < 0)
                    {
                        linear1_pin1.high();
                        linear1_pin2.low();
                    }
                    else
                    {
                        linear1_pin1.low();
                        linear1_pin2.low();
                    }
                }
                else if (event.number == 1) // Move y axis to move higher actuator
                {
                    if (event.value > 0)
                    {
                        linear2_pin1.low();
                        linear2_pin2.high();
                    }
                    else if (event.value < 0)
                    {
                        linear2_pin1.high();
                        linear2_pin2.low();
                    }
                    else
                    {
                        linear2_pin1.low();
                        linear2_pin2.low();
                    }
                }
            }


        }
        
  


    });


