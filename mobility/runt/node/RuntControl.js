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

var gpio = require('rpi-gpio');


// MOTOR Initialization
const MOTOR1A = 36;
const MOTOR1B = 38;
const MOTOR2A = 12;
const MOTOR2B = 13;
gpio.setup(MOTOR1A, gpio.DIR_OUT);
gpio.setup(MOTOR1B, gpio.DIR_OUT);
gpio.setup(MOTOR2A, gpio.DIR_OUT);
gpio.setup(MOTOR2B, gpio.DIR_OUT);


//var app = express();
//var server = require('http').Server(app);

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Allows us to contorl the GPIO pins on the raspberry pi
var gpio = require('rpi-gpio');

var PORT = 3000;
var HOST = 'localhost';

const HOME_PORT = 5000;
const HOME_HOST = '127.0.0.1';

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

const CONTROL_MESSAGE_ROVER = {
    commandType: "control",
    type: "rover_ack"
};

var gotAck = true;
var gotAckRover = true;
const TIME_TO_STOP = 750;
const TEST_CONNECTION = 3000;

//console.log('Loading mobility:');
// var hrarry = []
// var sum = 0;

// PWM Config for Pi Hat:
const makePwmDriver = require('adafruit-i2c-pwm-driver');
const pwm = makePwmDriver({
    address: 0x40,
    device: '/dev/i2c-1',
    debug: false
});

// Based on J. Stewart's calculations:
// May need to be adjusted/recalculated
// Values for Sabertooth 2X60:
//    1000 = Full Reverse
//    1500 = Stopped
//    2000 = Full Forward.
const saber_min = 1100; // Calculated to be 1000 us
const saber_max = 4095; // Calculated to be 2000 us

// Joystick values
const Joystick_MIN = -32767;
const Joystick_MAX = 32767;

// PWM Channel Config Motor:
const motor_left_channel = 0;
const motor_right_channel = 1;


// Based on J. Stewart's calculations:
pwm.setPWMFreq(50);

// NPM Library for USB Logitech Extreme 3D Pro Joystick input:
//    See: https://titanrover.slack.com/files/joseph_porter/F2DS4GBUM/Got_joystick_working_here_is_the_code.js
//    Docs: https://www.npmjs.com/package/joystick
//var joystick = new(require('joystick'))(0, 3500, 350);

// NPM Differential Steering Library:
//    Docs: https://www.npmjs.com/package/diff-steer

// Global Variables to Keep Track of Asynchronous Translated
//    Coordinate Assignment
var lastX = 0;
var lastY = 0;

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

function setLeft(speed) {

    pwm.setPWM(0, 0, parseInt(speed));
    
}

function setRight(speed) {
   
    pwm.setPWM(1, 0, parseInt(speed));
    
}
var setMotors = function(diffSteer) {
    setLeft(diffSteer.leftSpeed);
    setRight(diffSteer.rightSpeed);
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

    //xAxis = xAxis * -1;
    //yAxis = yAxis * -1;

    var V = (32767 - Math.abs(xAxis)) * (yAxis / 32767.0) + yAxis;
    var W = (32767 - Math.abs(yAxis)) * (xAxis / 32767.0) + xAxis;
    var right = (V + W) / 2.0;
    var left = (V - W) / 2.0;
	
 // Refactor this if you have time 
    if(right < 0){
            right = right.map(Joystick_MIN, 0, saber_max, saber_min);
            gpio.write(MOTOR1A, false);
            gpio.write(MOTOR1B,true);
        }else if(right === 0){
            gpio.write(MOTOR1A, false);
            gpio.write(MOTOR1B,false);
        }
    else {
            right = right.map(0, Joystick_MAX, saber_min, saber_max);
            gpio.write(MOTOR1A, true);
            gpio.write(MOTOR1B,false);
        }
    
    
    if(left < 0) {
        left = left.map(Joystick_MIN, 0, saber_max, saber_min);
        gpio.write(MOTOR2A, true);
        gpio.write(MOTOR2B,false);
    }else if(right === 0){
        gpio.write(MOTOR2A, false);
        gpio.write(MOTOR2B,false);
        }else{
        left = left.map(0, Joystick_MAX, saber_min, saber_max);
        gpio.write(MOTOR2A, false);
        gpio.write(MOTOR2B,true);
    }

    return {
        "leftSpeed": left,
        "rightSpeed": right
    };
}

// Set the throttle speed
function setThrottle(adjust_Amount) {
    throttleValue = adjust_Amount.map(32767, -32767, 0, 1);
    //console.log(throttleValue);
}


// Function that handles all mobility from the joystick
var receiveMobility = function(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    var axis = parseInt(joystickData.number);
    var value = parseInt(joystickData.value);

    var diffSteer;

    if (axis === 0 || axis === 1) {
        value = parseInt(value * throttleValue);
    }

    // X axis
    if (axis === 0) {
        diffSteer = calculateDiff(value, lastY);
        lastX = value;
    }
    // Y axis
    else if (axis === 1) {
        diffSteer = calculateDiff(lastX, value);
        lastY = value;
    }
    // Throttle axis
    else if (axis === 3) {
        setThrottle(value)
    }

    // If the Mobility recieved a driving axis.
    if (axis === 0 || axis === 1) {
        setMotors(diffSteer);
    }

	

};

// Send 0 to both the x and y axis to stop the rover from running
// Will only be invoked if we lose signal
function stopRover() {
    pwm.setPWM(0, 0, 0);
    pwm.setPWM(1, 0, 0);
}

// Send data to the homebase control for connection information
function sendHome(msg) {
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
    var msg = new Buffer(JSON.stringify(CONTROL_MESSAGE_ROVER));
    sendHome(msg);
    gotAckRover = false;
    setTimeout(function() {
        if (gotAckRover === false) {
            console.log("Stopping Rover: TEST CONNECTION from rover")
            stopRover();
        }
    }, TIME_TO_STOP);
}, TEST_CONNECTION);

/**
  Will handle the control messages that will tell us we have disconnected.
  * @param {JSON}
*/
function handleControl(message) {
    var msg;

    //console.log("Control Message with type: " + message.type);

    // If the homestation is testing our connection
    if (message.type == "test") {
        gotAck = false;
        msg = new Buffer(JSON.stringify(CONTROL_MESSAGE_ROVER));
        sendHome(msg);

        // Start a timer to see if we are still connected otherwise stop the rover moving
        setTimeout(function() {
            if (gotAck === false) {
                console.log("Stopping Rover: Test from HOME");
                stopRover();
            }
        }, TIME_TO_STOP);


        // Home station has responded don't need to stop.
    } else if (message.type == "ack") {
        gotAck = true;
        gotAckRover = true;
    }

}

function setPWM_HIGH(channel) {
    // PWM should go from LOW to HIGH right at the begginning
    // then should not go back down.
    pwm.setPWM(channel, 4095, 0);
}

function setPWM_LOW(channel) {
    // PWM should go from LOW to never going HIGH
    pwm.setPWM(channel, 0, 0);
}

function setLinearSpeed(channel, value) {
    const linear_min = 241; // Calculated to be 1000 us
    const linear_mid = 325; // Calculated to be 1500 us
    const linear_max = 409; // Calculated to be 2000 us

    if (value <= 0) {
        pwm.setPWM(channel, 0, parseInt(value.map(Joystick_MIN, 0, linear_min, linear_mid)));
    } else {
        pwm.setPWM(channel, 0, parseInt(value.map(0, Joystick_MAX, linear_mid, linear_max)));
    }
}



server.on('listening', function() {
    var address = server.address();
    console.log('Rover running on: ' + address.address + ':' + address.port);
});

// recieved a message from the homebase control perform an action
server.on('message', function(message, remote) {

    var msg = JSON.parse(message);
    //console.log(msg.commandType);

    // Seperate the incoming command to its specified subsystem
    switch (msg.commandType) {
        case 'mobility':
            receiveMobility(msg);
            break;
        case 'control':
            handleControl(msg);
            break;
        case 'arm':
            armControl(msg);
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
    console.log("\n####### Should not have pressed that!! #######\n");
    console.log("###### Deleting all files now!!! ######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    stopRover();
    gpio.destroy(function(){
	console.log('all pins unexported')});
    // some other closing procedures go here
    process.exit();
});
