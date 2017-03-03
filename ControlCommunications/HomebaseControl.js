/*
  Author: Joseph Porter
  Titan Rover - Command Station Control
  Description:
		Will be capturing events from the UI, Joystick, Keyboard, and etc...
        to transfer this command to the rover controller running on the Rover.

        It will send the packet with a commandType parameter to allow the rover system
        to decifer what kind of command it should be.  This will be added to whatever the input
        generates.

 =========== Layout of joystick =============

https://docs.google.com/document/d/1WDijduTZjryv08eI5N0dVvTw98pcXWOBMx0P8Qr28a8/edit?usp=sharing

*/

var gamepad = require('gamepad');
var request = require('request');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

// Initialize the library
gamepad.init();
setInterval(gamepad.processEvents, 16);
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

const SEND_CONTROL_AFTER = 20;
var packet_count = 0;

// Arm Variables
var arm_mode = false;

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

/**
  Will send the data message back to the rover to be process there
  * @param {Buffer}
*/
function send_to_rover(message) {
    message = new Buffer(JSON.stringify(message));
    socket.send(message, 0, message.length, PORT, "localhost", function(err) {
        if (err) {
            console.log("Problem with sending data!!!");
        } else {
            //console.log("Sent the data!!!")
            packet_count += 1;
        }
    });
}

// Listen for move events  
gamepad.on("move", function (id, axis, value) {
    event =  {
        id: id,
        axis: axis,
        value: value,
        commandType: null
    };
    // DEBUG 
    // console.log(event);

    // If the axis is 0 or 1 it is the left joystick
    if(axis <= 1){
        event.commandType = "mobility";
    }
    // Axis 2 and 3 (right joystick) controls inverse kinematics limb 1 and 2
    // Axis 4 and 5 (d-pad) will be used to control the rotating base and last limb
    else if(axis <= 5){
        event.commandType = "arm";
    }
    send_to_rover(event);
});


gamepad.on("down", function (id, num) {
    console.log(num);
    event =  {
        id: id,
        type: "down",
        axis: num,
        //value: value,
        commandType: "arm"
    };
});


