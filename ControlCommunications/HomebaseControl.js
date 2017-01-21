/*
  Author: Joseph Porter
  Titan Rover - Command Station Control
  Description: 
		Will be capturing events from the UI, Joystick, Keyboard, and etc...
        to transfer this command to the rover controller running on the Rover.
        
        It will send the packet with a commandType parameter to allow the rover system
        to decifer what kind of command it should be.  This will be added to whatever the input 
        generates.
        
        Example message for mobility
        { commandType: "mobility", time: 1693700, value: 0, number: 0, type: 'axis', id: 0 }
        
 =========== Layout of joystick =============

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

// The third parameter in the joystick declariation is the sensitivity of the joystick 
// higher the number less events will occur
var joystick = new (require('joystick'))(0, 3500, 500);
var request = require('request');

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var URL_ROVER = 'http://localhost:3000/command';

var PORT = 3000;
var HOST = '192.168.1.117';

joystick.on('button', onJoystickData);
joystick.on('axis', onJoystickData);

/*function sendCommand(command) {
    console.log(command);
    request.post({
		url: URL_ROVER,
		method: 'POST',
		json: true,
		body: command
	}, function(error, res, body) {
		if (error) {        
			console.log('ERROR OCCURED!!');
		}
		else {
			console.log(res.statusCode);
		}
	});
}
*/

/*function onJoystickData(event) {

    //console.log(event);
    
    // If it is axis data send as mobility
    if(event.type == "axis") {
	// If it is X or Y axis
	if(event.number == 0 || event.number == 1) {
        	event.commandType = "mobility";
	}
    }
    
    sendCommand(event);
}*/

function onJoystickData(event) {
    
    if(event.type == "axis") {
        if(event.number == 0 || event.number == 1) {
            event.commandTyoe = "mobility";
        }
    }


	var message = new Buffer(JSON.stringify(event));

	client.send(message, 0, message.length, PORT, HOST, function(err) {
		if (err) {
			console.log("Problem with sending data!!!");
		}
		else {
			console.log("Sent the data!!!")
		}
		//client.close();
	});
}
