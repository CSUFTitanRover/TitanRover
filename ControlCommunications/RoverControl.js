/*
  Author: Joseph Porter and Joe Edwards
  Titan Rover - Rover Control
  Description:
		Will be accepting commands from the homebase Controller and relaying
			these commands to its various sub processes

		Example:
			Moblility code will be sent from the homebase controller to here and this will run the input
				or pass it to another process to run it.

		It will be sent as JSON with the format
		{ commandType: string, ...}
		each packet will consist of a commandType such as mobility, science, arm and use this to determine
		the subprocess it should relay it to followed by the data that needs to be sent
*/
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
//var app = express();
//var server = require('http').Server(app);

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Importing arm functions
var arm = require('./arm');
// Allows us to contorl the rpio pins on the raspberry pi
var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600
});

var PORT = 3000;
var HOST = 'localhost';

const HOME_PORT = 5000;
var HOME_HOST = '';

// The global Config of the RoverControl can be changed by homebase control on the fly
var config = {
    Joystick_MIN: -32767,
    Joystick_MAX: 32767,
    arm_on: true,
    mobility_on: true,
    debug: false,
    TIME_TO_STOP: 1000,
    TEST_CONNECTION: 2000,
    saber_min: -127,
    saber_max: 127
};

var Mobility_arr = new Uint16Array(2);
Mobility_arr[0] = 0x0008;

var lastx = 0;
var lasty = 0;

/*var x_Axis_arr = new Uint16Array(2);
x_Axis_arr[0] = 0x0008;
var x_Axis_buff = Buffer.fromfunction getMobilityValue(value) {

}(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(2);
y_Axis_arr[0] = 0x0009;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);*/

var time = new Date();

// If debug is true will send this info back to homebase control.
var debug = {
    type: "debug",
    Number_Commands: 0,
    Num_Mobility_Commands: 0,
    Num_Arm_Commands: 0,
    Num_Unknown_Commands: 0,
    Tested_Connection_Num: 0,
    Lost_Connection_Num: 0,
    Start_Time: time.toString(),
    Curr_Time: time.toString(),
};

// This will be used to zero out the mobility when it has not recieved a message for a certain time.
// zeroMessage[0] for y axis
// zeroMessage[1] for x axis
var zeroMessage = [{
        commandType: "mobility",
        time: Date.now(),
        value: 0,
        number: 0,
        type: 'axis',
        id: 0
    },
    {
        commandType: "mobility",
        time: Date.now(),
        value: 0,
        number: 1,
        type: 'axis',
        id: 0
    }
];

// Message to test if we are still connected to homebase station
const CONTROL_MESSAGE_ROVER = {
    commandType: "control",
    type: "rover_ack"
};

// These consts handle connection information with the homebase
var gotAck = true;
var gotAckRover = true;

var triggerPressed = false;
var thumbPressed = false;


/**
 * Prototype function.  Map values from range in_min -> in_max to out_min -> out_max
 * @param {Number} in_min
 * @param {Number} in_max
 * @param {Number} out_min
 * @param {Number} out_max
 * @return {Number} An unnamed value described in range out_min -> out_max
 */
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

function getPwmValue(value) {
    if (value <= 0) {
        value = value.map(config.Joystick_MIN, 0, 1000, 1500);
    } else {
        value = value.map(0, config.Joystick_MAX, 1500, 2000);
    }

    return value;
}

function calculateDiff(yAxis, xAxis) {
    //xAxis = xAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);
    //yAxis = yAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);

    //xAxis = xAxis * -1;
    yAxis = yAxis * -1;

    var V = (Number(config.Joystick_MAX) - Math.abs(xAxis)) * (yAxis / Number(config.Joystick_MAX)) + yAxis;
    var W = (Number(config.Joystick_MAX) - Math.abs(yAxis)) * (xAxis / Number(config.Joystick_MAX)) + xAxis;
    var right = (V + W) / 2.0;
    var left = (V - W) / 2.0;

    if (right <= 0) {
        right = right.map(config.Joystick_MIN, 0, config.saber_min, 0);
    } else {
        right = right.map(0, config.Joystick_MAX, 0, config.saber_max);
    }

    if (left <= 0) {
        left = left.map(config.Joystick_MIN, 0, config.saber_min, 0);
    } else {
        left = left.map(0, config.Joystick_MAX, 0, config.saber_max);
    }

    return {
        "leftSpeed": left,
        "rightSpeed": right
    };
}

function mobilityWriteSpeed(diffSteer) {
    temp = diff.left;
    temp = temp << 8;
    temp |= diff.right;
    Mobility_arr[1] = temp;
    port.write(Mobility_arr);
}

// Function that handles all mobility from the joystick
function receiveMobility(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.number);
    var value = parseInt(joystickData.value);
    var diff;
    var temp;

    debug.Num_Mobility_Commands += 1;

    if (axis === 0) {
        diff = calculateDiff(value, lasty);
        mobilityWriteSpeed(diff);
    } else if (axis === 1) {
        diff = calculateDiff(lastx, value);
        mobilityWriteSpeed(diff);
    } else if (axis === null) //If sent from Gamepad
    {
        diff = calculateDiff(joystickData.x, joystickData.y);
        mobilityWriteSpeed(diff);
    }

}

/*
// Function that handles all mobility from the joystick
function receiveMobility(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.number);
    var value = parseInt(joystickData.value);

    value = getPwmValue(value);

    debug.Num_Mobility_Commands += 1;

    if (axis === 0) {
        x_Axis_arr[1] = value;
        port.write(x_Axis_buff);
    } else if (axis === 1) {
        y_Axis_arr[1] = value;
        port.write(y_Axis_buff);
    } else if (axis === null) //If sent from Gamepad
    {
        x_Axis_arr[1] = getPwmValue(joystickData.x);
        y_Axis_arr[1] = getPwmValue(joystickData.y);

        port.write(x_Axis_buff);
        port.write(y_Axis_buff);
    }

}*/

// Send 0 to both the x and y axis to stop the rover from running
// Will only be invoked if we lose signal
function stopRover() {
    //receiveMobility(zeroMessage[0]);
    //receiveMobility(zeroMessage[1]);
    x_Axis_arr[1] = 1500;
    y_Axis_arr[1] = 1500;
    port.write(x_Axis_buff);
    port.write(y_Axis_buff);
    // Stopping all joints
    for (i = 1; i <= 7; i++) {
        port.write(arm.stopJoint(i));
    }

}

// Send data to the homebase control for connection information
function sendHome(msg) {
    msg = new Buffer(JSON.stringify(msg));
    server.send(msg, 0, msg.length, HOME_PORT, HOME_HOST, function(err) {
        if (err) {
            console.log("Problem with sending data!!!");
        } else {
            //console.log("Sent the data!!!")
        }
    });
}

// Will test the connection to the homebase controller every TEST_CONNECTION times
// Will stop the rover if we have lost connection after TIME_TO_STOP
setInterval(function() {
    sendHome(CONTROL_MESSAGE_ROVER);
    debug.Tested_Connection_Num += 1;
    time = new Date();
    debug.Curr_Time = time.toString();
    if (config.debug) {
        sendHome(debug);
    }
    gotAckRover = false;
    setTimeout(function() {
        if (gotAckRover === false) {
            console.log("Stopping Rover: ROVER lost connection to HOME")
            debug.Lost_Connection_Num += 1;
            stopRover();
        }
    }, config.TIME_TO_STOP);
}, config.TEST_CONNECTION);

/**
  Will handle the control messages that will tell us we have disconnected.
  * @param {JSON} message
*/
function handleControl(message) {

    //console.log("Control Message with type: " + message.type);

    // If the homestation is testing our connection
    if (message.type == "test") {
        gotAck = false;
        sendHome(CONTROL_MESSAGE_ROVER);

        // Start a timer to see if we are still connected otherwise stop the rover moving
        setTimeout(function() {
            if (gotAck === false) {
                console.log("Stopping Rover: HOME tried to test us");
                stopRover();
            }
        }, config.TIME_TO_STOP);


        // Home station has responded don't need to stop.
    } else if (message.type == "ack") {
        gotAck = true;
        gotAckRover = true;
    } else if (message.type == "config") {
        config.debug = message.debug;
        config.arm_on = message.arm_on;
        config.mobility_on = message.mobility_on;
        config.Joystick_MAX = message.Joystick_MAX;
        config.Joystick_MIN = message.Joystick_MIN;
        console.log(config);
    }
}



// Will handle control of the arm one to one.
// Still need to figure out mapping of the joystick controller.
function armControl(message) {

    debug.Num_Arm_Commands += 1;

    if (message.type == 'axis') {
        var axis = parseInt(message.number);
        // Determine which axis should be which joint.
        switch (axis) {
            case 0:
                // Thumb button had to be pressed in order to use joint6
                if (thumbPressed) {
                    port.write(arm.joint6_360Unlimited(message));
                } else {
                    port.write(arm.joint3_linear2(message, getPwmValue(message.value)));
                }
                break;
            case 1:
                // Thumb button had to be pressed in order to use joint4
                if (thumbPressed) {
                    port.write(arm.joint4_rotateWrist(message));
                } else {
                    port.write(arm.joint2_linear1(message, getPwmValue(message.value)));
                }
                break;
            case 2:
                port.write(arm.joint1_rotatingBase(message));
                break;
            case 3:
                // This is the throttle
                break;
            case 4:
                port.write(arm.joint5_90degree(message));
                break;
            case 5:
                port.write(arm.joint7_gripper(message));
                break;
            default:
                throw new RangeError('invalid armcontrol axis');

        }
    } else if (message.type == 'button') {
        var button = parseInt(message.number);
        var val = parseInt(message.value);

        switch (button) {
            case 0:
                triggerPressed = val;
                break;
            case 1:
                // Switch our config to use other arm joints
                thumbPressed = !thumbPressed;
                if (thumbPressed) {
                    port.write(arm.stopJoint(2));
                    port.write(arm.stopJoint(3));
                } else {
                    port.write(arm.stopJoint(4));
                    port.write(arm.stopJoint(6));
                }
                break;
            default:
        }
    }
}


server.on('listening', function() {
    var address = server.address();
    console.log('Rover running on: ' + address.address + ':' + address.port);
});

// recieved a message from the homebase control to perform an action
server.on('message', function(message, remote) {

    HOME_HOST = remote.address;

    var msg = JSON.parse(message);
    //console.log(msg.commandType);

    debug.Number_Commands += 1;

    // Seperate the incoming command to its specified subsystem
    switch (msg.commandType) {
        case 'mobility':
            if (config.mobility_on) {
                receiveMobility(msg);
            }
            break;
        case 'control':
            handleControl(msg);
            break;
        case 'arm':
            if (config.arm_on) {
                armControl(msg);
            }
            break;
        default:
            debug.Num_Unknown_Commands += 1;
            throw new RangeError('commandType invalid');
    }
});

server.bind(PORT);

process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    stopRover();
    port.close();
    process.exit();
});

// On SIGINT shutdown the server
process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    stopRover();
    port.close();
    // some other closing procedures go here
    process.exit();
});
