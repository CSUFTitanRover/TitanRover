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

var dualShock = require('dualshock-controller');
var request = require('request');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');


//var URL_ROVER = 'http://localhost:3000/command';

const HOMEBASE_PORT = 5000;

// Port that the rover is hosting the udp server
const PORT = 3000;
var HOST = 'tr3.local'; // Needs to be the IP address of the rover

var controller = dualShock({
    config: "dualShock3",
    //smooths the output from the acelerometers (moving averages) defaults to true
    accelerometerSmoothing: true,
    //smooths the output from the analog sticks (moving averages) defaults to false
    analogStickSmoothing: false
});

const CHANGE_CONFIG = {
    commandType: "control",
    type: "config",
    Joystick_MAX: 127.50,
    Joystick_MIN: -127.50,
    arm_on: true,
    mobility_on: true
};

const GET_DEBUG_STATS = {
    commandType: "control",
    type: "debug"
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

controller.on('connected', function() {
    console.log('DualShock connected');
});

controller.on('error', function(err) {
    console.log('Error: ' + err);
});

controller.on('disconnecting', function() {
    console.log('DualShock has disconnected');
    var stopRover = {
        number: 2,
        x: 0,
        y: 0,
        commandType: 'mobility'
    };
    send_to_rover(stopRover);
});

controller.on('connection:change', function(data) {
    console.log('ConnectionChanged: ' + data);
});

// Shifting joystick values from 0-255 to -127.5 to 127.5
// Set to 25% speed since this joystick is only used to move rover from one place to another
controller.on('left:move', function(data) {
    event = {
        number: 2,
        x: (data.x - 127.5) * 0.50,
        y: ((data.y - 127.5) * 0.50),
        commandType: "mobility"
    };

    // Fix the zeroing point issue
    if (event.y < 1.5 && event.y > -1.5) {
        event.y = 0;
    }

    if (event.x < 1.5 && event.x > -1.5) {
        event.x = 0;
    }
    console.log(event);
    send_to_rover(event);
});
/*
//l2 should map to thumbPressed
controller.on('l2:press', function(data) {
    event = {
        number: null,
        type: 'axis',
        value: null,
        commandType: "arm"
    };
    send_to_rover(event);
});

controller.on('l2:release', function(data) {
    event = {
        number: null,
        type: 'axis',
        value: null,
        commandType: "arm"
    };
    send_to_rover(event);
});

// Turn rotatingbase counter clockwise
controller.on('square:press', function(data) {
    event = {
        number: 2,
        type: 'axis',
        value: -1,
        commandType: "arm"
    };
    send_to_rover(event);
});

// Stop turning counter clockwise
controller.on('square:release', function(data) {
    event = {
        number: 2,
        type: 'axis',
        value: 0,
        commandType: "arm"
    };
    send_to_rover(event);
});

// Turn rotatingbase  clockwise
controller.on('circle:press', function(data) {
    event = {
        number: 2,
        type: 'axis',
        value: 1,
        commandType: "arm"
    };
    send_to_rover(event);
});

// Stop turning rotatingbase  clockwise
controller.on('circle:release', function(data) {
    event = {
        number: 2,
        type: 'axis',
        value: 0,
        commandType: "arm"
    };
    send_to_rover(event);
});*/
