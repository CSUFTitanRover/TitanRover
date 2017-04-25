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

var mode = process.argv[2];
var joystick_0;
var joystick_1;

if (!mode || mode == 'both') {
    console.log('### Using both Mobility and Arm ###\n');
    joystick_0 = new(require('joystick'))(0, 3500, 500);
    joystick_1 = new(require('joystick'))(1, 3500, 500);
    joystick_0.on('button', handleJoystick_0);
    joystick_0.on('axis', handleJoystick_0);
    joystick_1.on('button', handleJoystick_1);
    joystick_1.on('axis', handleJoystick_1);
} else if (mode == 'mobility') {
    console.log('### Using only Mobility ###\n');
    joystick_0 = new(require('joystick'))(0, 3500, 500);
    joystick_0.on('button', handleJoystick_0);
    joystick_0.on('axis', handleJoystick_0);
} else if (mode == 'arm') {
    console.log('### Using only Arm ###\n');
    joystick_1 = new(require('joystick'))(0, 3500, 500);
    joystick_1.on('button', handleJoystick_1);
    joystick_1.on('axis', handleJoystick_1);
} else if (mode != 'none') {
    throw new Error('Dont understand this argument ' + mode);
}


var request = require('request');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

//var URL_ROVER = 'http://localhost:3000/command';

const HOMEBASE_PORT = 5000;

// Port that the rover is hosting the udp server
const PORT = 3000;
const HOST = 'localhost'; // Needs to be the IP address of the rover

const CONTROL_MESSAGE_ACK = {
    commandType: "control",
    type: "ack"
};

const CHANGE_CONFIG = {
    commandType: "control",
    type: "config",
    arm_on: true,
    Joystick_MIN: -32767,
    Joystick_MAX: 32767,
    mobility_on: true
};

const GET_DEBUG_STATS = {
    commandType: "control",
    type: "debug"
};

const RESET_ROVER = {
    commandType: "arm",
    number: 1
};

const SEND_CONTROL_AFTER = 20;
var packet_count = 0;

// Arm Variables
var arm_joint = false;

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
        send_to_rover(CONTROL_MESSAGE_ACK);
    } else if (msg.type == "debug") {
        console.log(msg);
    }
});

socket.bind(HOMEBASE_PORT);

/**
  Will send the data message back to the rover to be process there
  * @param {Buffer}
*/
function send_to_rover(message) {
    message = new Buffer(JSON.stringify(message));
    socket.send(message, 0, message.length, PORT, HOST, function(err) {
        if (err) {
            console.log("Problem with sending data!!!");
        } else {
            //console.log("Sent the data!!!")
            packet_count += 1;
        }
    });
}


// Joystick for Mobility
function handleJoystick_0(event) {

    if (event.type == "axis") {
        if (event.number == 0 || event.number == 1 || event.number == 3) {
            event.commandType = "mobility";
            send_to_rover(event);
        }
    } else if (event.number == 9 && event.value == 1) {
        send_to_rover(GET_DEBUG_STATS);
    } else if (event.type == 'button') {
        if (event.number == 10 && event.value == 1) {
            console.log("Mobility Joystick!!");
        }
    }
}


// Joystick for Arm
function handleJoystick_1(event) {

    if (event.type == 'axis') {
        event.commandType = 'arm';
        send_to_rover(event);
    }

    if (event.type == 'button') {

        // Handle each button seperatly since they could have different uses such as
        // hold down of press once

        // Trigger
        if (event.number == 0) {
            event.commandType = 'arm';
            send_to_rover(event);
        } else if (event.number == 1 && event.value == 1) { // Thumb
            event.commandType = 'arm';
            arm_joint = (arm_joint) ? false : true;
            if (arm_joint) {
                console.log("Joint 4 and 6 ## ONLINE ##\nJoint 2 and 3 ## OFFLINE ##");
            } else {
                console.log("Joint 2 and 3 ## ONLINE ##\nJoint 4 and 6 ## OFFLINE ##");
            }
            send_to_rover(event);
        } else if (event.number == 6 && event.value == 1) { // Button 7: Start the calibration sequence
            event.commandType = 'arm'
            //send_to_rover(event);
        } else if (event.number == 7 && event.value == 1) { // Button 8: Get back joint positions
            event.commandType = 'arm';
            send_to_rover(event)
        } else if (event.number == 9 && event.value == 1) { // Button 10: Get back debug statistics
            send_to_rover(GET_DEBUG_STATS);
        } else if (event.number == 10 && event.value == 1) { // Button 11: Determine which joystick is what
            console.log("Arm Joystick!!");
        }
    }
}
