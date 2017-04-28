
////////////////  I2C  Version   /////////////////

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var sleep = require('sleep');
//var app = express();
//var server = require('http').Server(app);

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Importing arm functions
var arm = require('./arm');
// Allows us to contorl the rpio pins on the raspberry pi
var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.raw
});

var PORT = 3000;
var HOST = 'localhost';

const HOME_PORT = 5000;
var HOME_HOST = '';

var i2c = require('i2c');

var device1 = new i2c(0x18, {
	device: '/dev/i2c-1', 
	debug: false
});

device1.setAddress(0x4);

// The global Config of the RoverControl can be changed by homebase control on the fly
var config = {
    Joystick_MIN: -32767,
    Joystick_MAX: 32767,
    arm_on: true,
    mobility_on: true,
    TIME_TO_STOP: 1000,
    TEST_CONNECTION: 2000,
    saber_min: 0,
    saber_max: 254
};

var x_Axis_arr = new Uint16Array(3);
x_Axis_arr[0] = 0x0008;
x_Axis_arr[2] = 0xbbaa;
var x_Axis_buff = Buffer.from(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(3);
y_Axis_arr[0] = 0x0009;
y_Axis_arr[2] = 0xbbaa;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);

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
    LastTime_ConnectionLost: time.toString()
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

function getPwmValue(value, Joystick_MAX, Joystick_MIN) {
    if (value <= 0) {
        value = value.map(Joystick_MIN, 0, 1000, 1500);
    } else {
        value = value.map(0, Joystick_MAX, 1500, 2000);
    }

    return parseInt(value);
}

function getMobilitySpeed(value, joystick_Max, joystick_Min) {
    if (value <= 0) {
        value = value.map(joystick_Min, 0, 0, 127);
    } else {
        value = value.map(0, joystick_Max, 127, 254);
    }

    if (value > 254) {
        value = 254;
    }

    if (value < 0) {
        value = 0;
    }

    return parseInt(value);
}

function setYAxis(y_speed) {
    if (y_speed < -127 || y_speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('Y: ' + y_speed );
    // Since we are using unsigened ints for serial make it between 0 and 254
    y_speed = y_speed + 127;
    parseInt(y_speed);
    y_Axis_arr[1] = y_speed;
    //x_Axis_arr[1] = parseInt(speed + 127);

    //console.log(y_Axis_buff);
    console.log(y_Axis_arr);
    console.log(y_Axis_buff);
    //device1.write(y_Axis_buff, function(){});
    device1.write(y_Axis_buff, function(){});
}

function setXAxis(x_speed) {
    if (x_speed < -127 || x_speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('x: ' + x_speed);
    // Since we are using unsigned ints for serial make it between 0 and 254
    x_speed = x_speed + 127;
    parseInt(x_speed);
    x_Axis_arr[1] = x_speed;
    console.log(x_Axis_arr);
    console.log(x_Axis_buff);
    //device1.write(x_Axis_buff, function(){});
    device1.write(x_Axis_buff, function(){});
}

// Function that handles all mobility from the joystick
/*function receiveMobility(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.number);
    var value = parseInt(joystickData.value);

    value = getPwmValue(value, 32767, -32767);

    debug.Num_Mobility_Commands += 1;

    if (axis === 0) {
        x_Axis_arr[1] = value;
        device1.write(x_Axis_buff, function(){});
        value *= -1;
        y_Axis_arr[1] = value;
        device1.write(y_Axis_buff, function(){});
    } else if (axis === 2) //If sent from Gamepad
    {
        x_Axis_arr[1] = getPwmValue(joystickData.x, 127.5, -127.5);
        y_Axis_arr[1] = getPwmValue(joystickData.y, 127.5, -127.5);

        device1.write(x_Axis_buff, function(){});
        device1.write(y_Axis_buff, function(){});
    }
}*/

function receiveMobility(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.number);
    var value = parseInt(joystickData.value);

    value = getMobilitySpeed(value, 32767, -32767);

    debug.Num_Mobility_Commands += 1;

    if (axis === 0) {
        x_Axis_arr[1] = value;
        device1.write(x_Axis_buff, function(){});
    } else if (axis === 1) {
        y_Axis_arr[1] = value;
        device1.write(y_Axis_buff, function(){});
    } else if (axis === 2) //If sent from Gamepad
    {
        x_Axis_arr[1] = getMobilitySpeed(joystickData.x, 127.5, -127.5);
        y_Axis_arr[1] = getMobilitySpeed(joystickData.y, 127.5, -127.5);

        device1.write(x_Axis_buff, function(){});
        device1.write(y_Axis_buff, function(){});
    }

}


function stopRover() {
    //receiveMobility(zeroMessage[0]);
    //receiveMobility(zeroMessage[1]);
    x_Axis_arr[1] = 127;
    y_Axis_arr[1] = 127;
    //device1.write(x_Axis_buff, function(){});
    //device1.write(y_Axis_buff, function(){});
    device1.write(x_Axis_buff, function(){});
    device1.write(y_Axis_buff, function(){});
    // Stopping all joints

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
    gotAckRover = false;
    setTimeout(function() {
        if (gotAckRover === false) {
            console.log("Stopping Rover: ROVER lost connection to HOME")
            debug.Lost_Connection_Num += 1;
            time = new Date();
            debug.LastTime_ConnectionLost = time.toString();
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
        config.arm_on = message.arm_on;
        config.mobility_on = message.mobility_on;
        config.Joystick_MAX = message.Joystick_MAX;
        config.Joystick_MIN = message.Joystick_MIN;
        console.log(config);
    } else if (message.type == "debug") {
        time = new Date();
        debug.Curr_Time = time.toString();
        sendHome(debug);
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
                    device1.write(arm.joint6_360Unlimited(message), function(){});
                } else {
                    device1.write(arm.joint3_linear2(message, getPwmValue(message.value, 32767, -32767)), function(){});
                }
                break;
            case 1:
                // Thumb button had to be pressed in order to use joint4
                if (thumbPressed) {
                    device1.write(arm.joint4_rotateWrist(message), function(){});
                } else {
                    device1.write(arm.joint2_linear1(message, getPwmValue(message.value, 32767, -32767)), function(){});
                }
		break;
            case 2:
                device1.write(arm.joint1_rotatingBase(message), function(){});
                break;
            case 3:
                // This is the throttle
                break;
            case 4:
                device1.write(arm.joint5_90degree(message), function(){});
                break;
            case 5:
                device1.write(arm.joint7_gripper(message), function(){});
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
                    device1.write(arm.stopJoint(2), function(){});
                    device1.write(arm.stopJoint(3), function(){});
                } else {
                    device1.write(arm.stopJoint(4), function(){});
                    device1.write(arm.stopJoint(6), function(){});
                }
                break;
            case 6:
                device1.write(arm.calibrate(), function(){});
                break;
            case 7:
                device1.write(arm.getJointInfo(), function(){});
                break;
            default:
        }
    }
}

// Any serial data from the arduino will be sent back home
// and printed to the console
port.on('data', function(data) {
    console.log('ArduinoMessage: ' + data);
    var jsonBuilder = {};
    jsonBuilder.ArduinoMessage = data;
    jsonBuilder.type = 'debug';

    sendHome(jsonBuilder);

});

var i = -127;
var hasDelayed = false;
var main = setInterval(function(){
    if (i < 128) {
    
    //setXAxis(i);
    setXAxis(i);
    if (!hasDelayed) {
	sleep.sleep(5);
	hasDelayed = true;
	setXAxis(i);
    }
    } else {
        stopRover();
        clearInterval(main);
	process.exit();
    }
        //setTimeout(function(){;},1000);
    i++;
},50);

server.on('listening', function() {
    var address = server.address();
    console.log('Rover running on: ' + address.address + ':' + address.port);

});

// recieved a message from the homebase control to perform an action
server.on('message', function(message, remote) {

    HOME_HOST = remote.address;

    var msg = JSON.parse(message);
    //console.log(msg.commandType);
    //console.log(msg);

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
            console.log(msg);
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
