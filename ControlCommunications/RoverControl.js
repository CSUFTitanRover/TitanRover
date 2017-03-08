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
    TEST_CONNECTION: 2000
};

var time = new Date();

// If debug is true will send this info back to homebase control.
var debug = {
    type: "debug",
    Number_Commands: 0,
    Num_Mobility_Commands: 0,
    Num_Arm_Commands: 0,
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
 * Every movement command will be represented in 4 bytes
 * The first byte will be the object that needs to movement
 * in case of pwm signal object byte 3 and 4 will represent the signal between 1000 - 2000
 * in case of stepper motor byte 2 will be direction. Byte 3 will be on or off.  Byte 4 is still
 * up for grabs but will probably be steps
 */
var x_Axis_arr = new Uint16Array(2);
x_Axis_arr[0] = 0x0800;
var x_Axis_buff = Buffer.from(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(2);
y_Axis_arr[0] = 0x0900;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);

var joint1_arr = new Uint16Array(2);
var joint1_buff = Buffer.from(joint1_arr.buffer);

var joint2_arr = new Uint16Array(2);
joint2_arr[0] = 0x0200;
var joint2_buff = Buffer.from(joint2_arr.buffer);

var joint3_arr = new Uint16Array(2);
joint3_arr[0] = 0x0300;
var joint3_buff = Buffer.from(joint3_arr.buffer);

var joint4_arr = new Uint16Array(2);
var joint4_buff = Buffer.from(joint4_arr.buffer);

var joint5_arr = new Uint16Array(2);
var joint5_buff = Buffer.from(joint5_arr.buffer);

var joint6_arr = new Uint16Array(2);
var joint6_buff = Buffer.from(joint6_arr.buffer);

var joint7_arr = new Uint16Array(2);
var joint7_buff = Buffer.from(joint7_arr.buffer);



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
    }
    else if( axis === null)  //If sent from Gamepad
    {
         x_Axis_arr[1] = joystickData.x;
         y_Axis_arr[1] = joystickData.y;

         port.write(x_Axis_buff);
         port.write(y_Axis_buff);
    }

}

// Send 0 to both the x and y axis to stop the rover from running
// Will only be invoked if we lose signal
function stopRover() {
    receiveMobility(zeroMessage[0]);
    receiveMobility(zeroMessage[1]);

    joint1_arr[1] = 0x0000;
    joint2_arr[1] = 0x05dc;
    joint3_arr[1] = 0x05dc;
    joint4_arr[1] = 0x0000;
    joint5_arr[1] = 0x0000;
    joint6_arr[1] = 0x0000;
    joint7_arr[1] = 0x0000;

    port.write(joint1_buff);
    port.write(joint2_buff);
    port.write(joint3_buff);
    port.write(joint4_buff);
    port.write(joint5_buff);
    port.write(joint6_buff);
    port.write(joint7_buff);
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

/**
 * Joint1: Phantom Menace
 * The rotating base for the arm
 * Driver: Sumtor mb450a
 */
function joint1_rotatingBase(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        joint1_arr[0] = 0x0101;
    } else {
        joint1_arr[0] = 0x0100;
    }

    if (value === 0) {
        joint1_arr[1] = 0x0000;
    } else {
        joint1_arr[1] = 0x0100;
    }

    port.write(joint1_buff);

}

/**
 * Joint2: Attack of the Clones
 * Will be the longer first linear Actuator
 * Driver: Actobotics Dual Motor Controller
 */
function joint2_linear1(message) {
    let value = parseInt(message.value);

    value = getPwmValue(value);

    joint2_arr[1] = value;

    port.write(joint2_buff);

}

/**
 * Joint3: Revenge of the Sith
 * Will be the smaller second linear Actuator
 * Driver: Actobotics Dual Motor Controller
 */
function joint3_linear2(message) {
    let value = parseInt(message.value);

    value = getPwmValue(value);

    joint2_arr[1] = value;

    port.write(joint2_buff);
}

/**
 * Joint4: A New Hope
 * The 180 degree wrist
 * Driver: Sumtor mb450a
 */
function joint4_rotateWrist(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        joint4_arr[0] = 0x0401;
    } else {
        joint4_arr[0] = 0x0400;
    }

    if (value === 0) {
        joint4_arr[1] = 0x0000;
    } else {
        joint4_arr[1] = 0x0100;
    }

    port.write(joint4_buff);
}

/**
 * Joint5: Empire Strikes Back
 * The 90 degree joint
 * Driver: Sumtor mb450a
 */
function joint5_90degree(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        joint5_arr[0] = 0x0501;
    } else {
        joint5_arr[0] = 0x0500;
    }

    if (value === 0) {
        joint5_arr[1] = 0x0000;
    } else {
        joint5_arr[1] = 0x0100;
    }

    port.write(joint5_buff);
}

/**
 * Joint6: Return of the Jedi
 * 360 degree rotation of this joint no need for limit switches
 * Driver is a Pololu
 */
function joint6_360Unlimited(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        joint6_arr[0] = 0x0601;
    } else {
        joint6_arr[0] = 0x0600;
    }

    if (value === 0) {
        joint6_arr[1] = 0x0000;
    } else {
        joint6_arr[1] = 0x0100;
    }

    port.write(joint6_buff);
}

/**
 * Joint7: The Force Awakings
 * The gripper that is a linear actuator
 * Driver: Pololu AMIS-30543
 */
function joint7_gripper(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        joint7_arr[0] = 0x0701;
    } else {
        joint7_arr[0] = 0x0700;
    }

    if (value === 0) {
        joint7_arr[1] = 0x0000;
    } else {
        joint7_arr[1] = 0x0100;
    }

    port.write(joint7_buff);
}

/**
 * Tell this joint to stop moving
 * @param {int} jointNum 1 - 7
 */
function stopJoint(jointNum) {
    switch (jointNum) {
        case 1:
            joint1_arr[1] = 0x0000;
            port.write(joint1_buff);
            break;
        case 2:
            joint2_arr[1] = 0x05dc;
            port.write(joint2_buff);
            break;
        case 3:
            joint3_arr[1] = 0x05dc;
            port.write(joint3_buff);
            break;
        case 4:
            joint4_arr[1] = 0x0000;
            port.write(joint4_buff);
            break;
        case 5:
            joint5_arr[1] = 0x0000;
            port.write(joint5_buff);
            break;
        case 6:
            joint6_arr[1] = 0x0000;
            port.write(joint6_buff);
            break;
        case 7:
            joint7_arr[1] = 0x0000;
            port.write(joint7_buff);
            break;
        default:
            console.log(jointNum + " joint does not exist");
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
                    joint6_360Unlimited(message);
                } else {
                    joint3_linear2(message);
                }
                break;
            case 1:
                // Thumb button had to be pressed in order to use joint4
                if (thumbPressed) {
                    joint4_rotateWrist(message);
                } else {
                    joint2_linear1(message);
                }
                break;
            case 2:
                joint1_rotatingBase(message);
                break;
            case 3:
                // This is the throttle
                break;
            case 4:
                joint5_90degree(message);
                break;
            case 5:
                joint7_gripper(message);
                break;
            default:

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
                thumbPressed = (thumbPressed) ? false : true;
                if (thumbPressed) {
                    stopJoint(2);
                    stopJoint(3);
                } else {
                    stopJoint(4);
                    stopJoint(6);
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
            //console.log("###### Could not find commandType #######");
    }
});

server.bind(PORT);

process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    stopRover();
    process.exit();
});

// On SIGINT shutdown the server
process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    stopRover();
    // some other closing procedures go here
    process.exit();
});;
