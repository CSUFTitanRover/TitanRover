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

// Make sure the joystick is plugged into the computer

var joystick = new(require('joystick'))(0, 3500, 500);
var request = require('request');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

//var URL_ROVER = 'http://localhost:3000/command';

const HOMEBASE_PORT = 5000;

// Port that the rover is hosting the udp server
const PORT = 3000;
const HOST = '192.168.1.117'; // Needs to be the IP address of the rover

// Control information
const CONTROL_MESSAGE_TEST = {
    commandType: "control",
    type: "test"
};

const CONTROL_MESSAGE_ACK = {
    commandType: "control",
    type: "ack"
};

const SEND_CONTROL_AFTER = 10;
var packet_count = 0;

// Arm Variables
var arm_mode = false;

// Joystick event handlers
joystick.on('button', onJoystickData);
joystick.on('axis', onJoystickData);

// Socket event handlers
socket.on('listening', function() {
    console.log('Running control on: ' + socket.address().address + ':' + socket.address().port);
});

// When we recieve a packet from the rover it is acking a control packet
socket.on('message', function(message, remote) {
    var msg = JSON.parse(message);

    if (msg.type == "rover_ack") {
        //console.log("Rover sent an ack");
        packet_count = 0;
        send_to_rover(new Buffer(JSON.stringify(CONTROL_MESSAGE_ACK)));
    }
});

socket.bind(HOMEBASE_PORT);

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

/**
  Will send the data message back to the rover to be process there
  * @param {Buffer}
*/
function send_to_rover(message) {
    socket.send(message, 0, message.length, PORT, HOST, function(err) {
        if (err) {
            console.log("Problem with sending data!!!");
        } else {
            //console.log("Sent the data!!!")
            packet_count += 1;
        }
    });
}

function onJoystickData(event) {

    var message;

    if (packet_count > SEND_CONTROL_AFTER) {
        message = new Buffer(JSON.stringify(CONTROL_MESSAGE_TEST));
        //console.log("Sending Control MESSAGE: " + packet_count);
        send_to_rover(message);
    }

    if (arm_mode) {
        if (event.type == "axis") {
            event.commandType = "arm";
        }
    } else {
        if (event.type == "axis") {
            if (event.number == 0 || event.number == 1 || event.number == 3) {
                event.commandType = "mobility";
            }
        }
    }
    //console.log(event);


    // Handle button presses
    if (event.type == "button") {
        // Change joystick from mobility to arm control
        if (event.number == 1) {
            arm_mode = arm_mode ? false : true;
        }
    }

    message = new Buffer(JSON.stringify(event));

    send_to_rover(message);
}
