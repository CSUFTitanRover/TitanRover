/*
  Author: Joseph Porter
  Titan Rover - Joystick Controller 
  Description: 
    
    Sending the data from the Joystick to the rovers server
    
    Will be sending them using UDP packets, since we will be sending a 
    lot of data
*/
var joystick = new (require('joystick'))(0, 3500, 350);
var dgram = require('dgram');
var client = dgram.createSocket('udp4');


joystick.on('button', onJoystickData);
joystick.on('axis', onJoystickData);


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

	var message = new Buffer(JSON.stringify(event));

	client.send(message, 0, message.length, 5000, "localhost", function(err) {
		if (err) {
			console.log("Problem with sending data!!!");
		}
		else {
			console.log("Sent the data!!!")
		}
		//client.close();
	});
}
