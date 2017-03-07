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



var PORT = 3000;
var HOST = 'localhost';

const HOME_PORT = 5000;
var HOME_HOST = '';

// The global Config of the RoverControl can be changed by homebase control on the fly
var config = {
    Joystick_MIN: -127.5,
    Joystick_MAX: 127.5,
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

// PWM Config for Pi Hat:
// const makePwmDriver = require('adafruit-i2c-pwm-driver');
// const pwm = makePwmDriver({
//     address: 0x40,
//     device: '/dev/i2c-1',
//     debug: false
// });

// Based on J. Stewart's calculations:
// May need to be adjusted/recalculated
// Values for Sabertooth 2X60:
//    1000 = Full Reverse
//    1500 = Stopped
//    2000 = Full Forward.
const saber_min = 241; // Calculated to be 1000 us
const saber_mid = 325; // Calculated to be 1500 us
const saber_max = 409; // Calculated to be 2000 us

var triggerPressed = false;
var thumbPressed = false;

// PWM Channel Config Motor:
const motor_left_channel = 0;
const motor_right_channel = 1;




// Based on J. Stewart's calculations:
//pwm.setPWMFreq(50);

// NPM Library for USB Logitech Extreme 3D Pro Joystick input:
//    See: https://titanrover.slack.com/files/joseph_porter/F2DS4GBUM/Got_joystick_working_here_is_the_code.js
//    Docs: https://www.npmjs.com/package/joystick
//var joystick = new(require('joystick'))(0, 3500, 350);



// Global Variables to Keep Track of Asynchronous Translated
//    Coordinate Assignment
var lastX = 0;
var lastY = 0;

// Sets the speed at which the joystick values will be used
var throttleValue = 1.0;

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

/**
 * Adjusts the speed by an exponential factor.  This makes acceleration a function
 *  of the product of differential steering and distance of joystick from its origin
 * @param {Number} x
 * @param {Number} y
 * @return {Number} A value between 0 and 1 that represents ratio of distance from
 *      origin to joystick coordinate.  Effectively lowers speed closer to origin.
 */
var speedAdjust = function(x, y) {
    var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var acceleration = (distance > Joystick_MAX) ? 1 : distance / Joystick_MAX;
    return acceleration;
};

/**
  Differential steering calculations are done here
  * @param {xAxis}
  * @param {yAxis}
  * @return {speed_of_leftandright}
  */
function calculateDiff(yAxis, xAxis) {
    //xAxis = xAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);
    //yAxis = yAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);

     xAxis = xAxis * -1;
     yAxis = yAxis * -1;

    var V = (Number(config.Joystick_MAX) - Math.abs(xAxis)) * (yAxis / Number(config.Joystick_MAX)) + yAxis;
    var W = (Number(config.Joystick_MAX) - Math.abs(yAxis)) * (xAxis / Number(config.Joystick_MAX)) + xAxis;
    var right = (V + W) / 2.0;
    var left = (V - W) / 2.0;

    if (right <= 0) {
        right = right.map(config.Joystick_MIN, 0, saber_min, saber_mid);
    } else {
        right = right.map(0, config.Joystick_MAX, saber_mid, saber_max);
    }

    if (left <= 0) {
        left = left.map(config.Joystick_MIN, 0, saber_min, saber_mid);
    } else {
        left = left.map(0, config.Joystick_MAX, saber_mid, saber_max);
    }
    
    return {
        "leftSpeed": left,
        "rightSpeed": right
    };
}


// Function that handles all mobility from the joystick
var receiveMobility = function(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    debug.Num_Mobility_Commands += 1;

    diffSteer = calculateDiff(joystickData.y,joystickData.x);
    
    // pwm.setPWM(motor_left_channel, 0, parseInt(diffSteer.leftSpeed));
    // pwm.setPWM(motor_right_channel, 0, parseInt(diffSteer.rightSpeed));
};

// Send 0 to both the x and y axis to stop the rover from running
// Will only be invoked if we lose signal
// function stopRover() {
//     receiveMobility(zeroMessage[0]);
//     receiveMobility(zeroMessage[1]);

//     // Shutdown the arm
//     port.write(joint1_off);
//     setLinearSpeed(joint2_pwm_pin, 0);
//     setLinearSpeed(joint3_pwm_pin, 0);
//     port.write(joint4_off);
//     port.write(joint5_off);
//     port.write(joint6_off);
//     port.write(joint7_off);

// }

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
            //stopRover();
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
                //stopRover();
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
 * Sends a PWM signal to the appropriate Linear Actuator
 * @param {int} channel PWM pin of linear Actuator
 * @param {int} value Will be between -1 and Joystick_MAX
 */
// function setLinearSpeed(channel, value) {
//     const linear_min = 241; // Calculated to be 1000 us
//     const linear_mid = 325; // Calculated to be 1500 us
//     const linear_max = 409; // Calculated to be 2000 us

//     var pwmSig;

//     if (value <= 0) {
//         pwmSig = parseInt(value.map(config.Joystick_MIN, 0, linear_min, linear_mid));
//         pwm.setPWM(channel, 0, pwmSig);
//     } else {
//         pwmSig = parseInt(value.map(0, config.Joystick_MAX, linear_mid, linear_max));
//         pwm.setPWM(channel, 0, pwmSig);
//     }
// }



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
                //armControl(msg);
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
    closePins();
    process.exit();
});

// On SIGINT shutdown the server
process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    stopRover();
    closePins();
    // some other closing procedures go here
    process.exit();
});;
