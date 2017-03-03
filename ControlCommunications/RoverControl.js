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
var rpio = require('rpio');
var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600
});

var PORT = 3000;
var HOST = 'localhost';

const HOME_PORT = 5000;
const HOME_HOST = '192.168.1.143';

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
const TIME_TO_STOP = 750;
const TEST_CONNECTION = 3000;

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
const saber_min = 241; // Calculated to be 1000 us
const saber_mid = 325; // Calculated to be 1500 us
const saber_max = 409; // Calculated to be 2000 us

// Joystick values
const Joystick_MIN = -1.0;
const Joystick_MAX = 1.0;
var triggerPressed = false;
var thumbPressed = false;

// PWM Channel Config Motor:
const motor_left_channel = 0;
const motor_right_channel = 1;

/** All GPIO pins are the actual pins so 1-40
 * @param {joint_move_pin}
 * This pin is used to tell the arduino to send the pulse signals
 * @param {joint_dir_pin}
 * Tells the stepper which direction it should go
 * @param {joint_enab_pin}
 * Tells the stepper motor to hold its position after movement.
 *
 * This applies to joint1, joint4, joint5 which are the sumtor stepper motor drivers
 */

// Joint1 rotating base pins
const joint1_dir_pin = 11;
const joint1_enab_pin = 13;
const joint1_on = '1';
const joint1_off = '2';

// Set all pins to low on init
rpio.open(joint1_dir_pin, rpio.OUTPUT, rpio.LOW);
rpio.open(joint1_enab_pin, rpio.OUTPUT, rpio.LOW);

// Joint2 PWM pins
const joint2_pwm_pin = 4;

// Joint3 PWM pins
const joint3_pwm_pin = 5;

// joint 4 Sumtor pins
const joint4_dir_pin = 32;
const joint4_enab_pin = 36;
const joint4_on = '3';
const joint4_off = '4';

// Set all pins to low on init
rpio.open(joint4_dir_pin, rpio.OUTPUT, rpio.LOW);
rpio.open(joint4_enab_pin, rpio.OUTPUT, rpio.LOW);

// joint 5 Sumtor pins
const joint5_dir_pin = 15;
const joint5_enab_pin = 18;
const joint5_on = '5';
const joint5_off = '6';

// Set all pins to low on init
rpio.open(joint5_dir_pin, rpio.OUTPUT, rpio.LOW);
rpio.open(joint5_enab_pin, rpio.OUTPUT, rpio.LOW);

// Joint 6 Pololu pins
const joint6_dir_pin = 12;
const joint6_on = '7';
const joint6_off = '8';

// Set all pins to low on init
rpio.open(joint6_dir_pin, rpio.OUTPUT, rpio.LOW);

// Joint 7 Pololu pins
const joint7_dir_pin = 0;
const joint7_on = '9';
const joint7_off = '0';

// Set all pins to low on init
rpio.open(joint7_dir_pin, rpio.OUPTUT, rpio.LOW);


// Pins to destroy
// Will be used when program exits to close these pins
var pins = [11, 12, 13, 15, 18, 32, 36];


// Based on J. Stewart's calculations:
pwm.setPWMFreq(50);

// NPM Library for USB Logitech Extreme 3D Pro Joystick input:
//    See: https://titanrover.slack.com/files/joseph_porter/F2DS4GBUM/Got_joystick_working_here_is_the_code.js
//    Docs: https://www.npmjs.com/package/joystick
//var joystick = new(require('joystick'))(0, 3500, 350);

// NPM Differential Steering Library:
//    Docs: https://www.npmjs.com/package/diff-steer
var steerMotors = require('diff-steer/motor_control');

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
}

function setLeft(speed) {
    pwm.setPWM(motor_left_channel, 0, parseInt(speed));
}

function setRight(speed) {
    pwm.setPWM(motor_right_channel, 0, parseInt(speed));
}

var setMotors = function(diffSteer) {
    setLeft(diffSteer.leftSpeed);
    setRight(diffSteer.rightSpeed);
    //console.log(diffSteer);
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

    var V = (Joystick_MAX - Math.abs(xAxis)) * (yAxis / Joystick_MAX) + yAxis;
    var W = (Joystick_MAX - Math.abs(yAxis)) * (xAxis / Joystick_MAX) + xAxis;
    var right = (V + W) / 2.0;
    var left = (V - W) / 2.0;

    if (right <= 0) {
        right = right.map(Joystick_MIN, 0, saber_min, saber_mid);
    } else {
        right = right.map(0, Joystick_MAX, saber_mid, saber_max);
    }

    if (left <= 0) {
        left = left.map(Joystick_MIN, 0, saber_min, saber_mid);
    } else {
        left = left.map(0, Joystick_MAX, saber_mid, saber_max);
    }

    return {
        "leftSpeed": left,
        "rightSpeed": right
    };
}

// Set the throttle speed
function setThrottle(adjust_Amount) {
    throttleValue = adjust_Amount.map(Joystick_MAX, Joystick_MIN, 0, 1);
    //console.log(throttleValue);
}


// Function that handles all mobility from the joystick
var receiveMobility = function(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.axis);
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
    receiveMobility(zeroMessage[0]);
    receiveMobility(zeroMessage[1]);

    // Shutdown the arm
    /*
    port.write(joint1_off);
    port.write(joint2_off);
    port.write(joint3_off);
    port.write(joint4_off);
    port.write(joint5_off);
    port.write(joint6_off);
    port.write(joint7_off);
    */

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
            console.log("Stopping Rover: ROVER lost connection to HOME")
            stopRover();
        }
    }, TIME_TO_STOP);
}, TEST_CONNECTION);

/**
  Will handle the control messages that will tell us we have disconnected.
  * @param {JSON} message
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
                console.log("Stopping Rover: HOME tried to test us");
                stopRover();
            }
        }, TIME_TO_STOP);


        // Home station has responded don't need to stop.
    } else if (message.type == "ack") {
        gotAck = true;
        gotAckRover = true;
    }

}

/**
 * Sends a PWM signal to the appropriate Linear Actuator
 * @param {int} channel PWM pin of linear Actuator
 * @param {int} value Will be between -1 and Joystick_MAX
 */
function setLinearSpeed(channel, value) {
    const linear_min = 241; // Calculated to be 1000 us
    const linear_mid = 325; // Calculated to be 1500 us
    const linear_max = 409; // Calculated to be 2000 us

    var pwmSig;

    if (value <= 0) {
        pwmSig = parseInt(value.map(Joystick_MIN, 0, linear_min, linear_mid));
        pwm.setPWM(channel, 0, pwmSig);
    } else {
        pwmSig = parseInt(value.map(0, Joystick_MAX, linear_mid, linear_max));
        pwm.setPWM(channel, 0, pwmSig);
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
        rpio.write(joint1_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint1_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint1_off);
    } else {
        port.write(joint1_on);
    }

}

/**
 * Joint2: Attack of the Clones
 * Will be the longer first linear Actuator
 * Driver: Actobotics Dual Motor Controller
 */
function joint2_linear1(message) {
    let value = parseInt(message.value);
    setLinearSpeed(joint2_pwm_pin, value);
}

/**
 * Joint3: Revenge of the Sith
 * Will be the smaller second linear Actuator
 * Driver: Actobotics Dual Motor Controller
 */
function joint3_linear2(message) {
    let value = parseInt(message.value);
    setLinearSpeed(joint3_pwm_pin, value);
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
        rpio.write(joint4_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint4_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint4_off);
    } else {
        port.write(joint4_on);
    }

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
        rpio.write(joint5_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint5_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint5_off);
    } else {
        port.write(joint5_on);
    }

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
        rpio.write(joint6_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint6_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint6_off);
    } else {
        port.write(joint6_on);
    }
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
        rpio.write(joint7_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint7_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint7_off);
    } else {
        port.write(joint7_on);
    }
}

/**
 * Tell this joint to stop moving
 * @param {int} jointNum 1 - 7
 */
function stopJoint(jointNum) {
    switch (jointNum) {
        case 1:
            port.write(joint1_off);
            break;
        case 2:
            port.write(joint2_off);
            break;
        case 3:
            port.write(joint3_off);
            break;
        case 4:
            port.write(joint4_off);
            break;
        case 5:
            port.write(joint5_off);
            break;
        case 6:
            port.write(joint6_off);
            break;
        case 7:
            port.write(joint7_off);
            break;
        default:
            console.log(jointNum + " joint does not exist");
    }
}


// Will handle control of the arm one to one.
// Still need to figure out mapping of the joystick controller.
function armControl(message) {

    if (message.type == 'axis') {
        var axis = parseInt(message.axis);
        // Determine which axis should be which joint.
        switch (axis) {
            case 0:
                if (thumbPressed) {
                    joint3_linear2(message);
                } else {
                    joint6_360Unlimited(message);
                }
                break;
            case 1:
                if (thumbPressed) {
                    joint2_linear1(message);
                } else {
                    joint4_rotateWrist(message);
                }
                break;
            case 2:
                joint1_rotatingBase(message);
                break;
            case 3:
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
        var button = parseInt(message.axis);
        var val = parseInt(message.value);

        switch (button) {
            case 0:
                triggerPressed = val;
                break;
            case 1:
                thumbPressed = val;
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

// Will close all the pins that were in use by this process
function closePins() {
    pins.forEach(function(value) {
        rpio.close(value);
    });
}

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
});
