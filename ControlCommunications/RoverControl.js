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
const servo_min = 204; // Calculated to be 1000 us
const servo_mid = 325; // Calculated to be 1500 us
const servo_max = 459; // Calculated to be 2000 us

const Joystick_MIN = -32767;
const Joystick_MAX = 32767;

// PWM Channel Config:
const left_channel = 0;
const right_channel = 1;

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
 * TESTING ONLY! Function called on axis change from Joystick.  This function only responds to changes on X or Y,
 number 0 or 1 respectively.  (1) Gets changed joystick value per X or Y Axis, (3) Calculate
 differential steering by mappng joystick range to diff-steer range and stores the result in
 lastX or last Y depending on axis changed, (4) Send values with proper channels to send values
 to motors.
 * @param {Event} event.  Describes number, value, where number is axis and value is joystick value
 */

/**
 * Function called on axis change from Joystick.  This function only responds to changes on X or Y,
 number 0 or 1 respectively.  (1) Gets changed joystick value per X or Y Axis, (3) Calculate
 differential steering by mappng joystick range to diff-steer range and stores the result in
 lastX or last Y depending on axis changed, (4) Send values with proper channels to send values
 to motors.
  * @param {Int} channel.  Value described by left_channel or right_channel corresponding to pin outs
  * @param {JSON} diffSteer.  Differntial steering calculations for one side described by channel
 */
/*var setMotors = function(diffSteer, channel) {

    if (diffSteer.direction === 'rev') {
        pwm.setPWM(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_max)));
    } else {
        pwm.setPWM(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_min)));
    }
};*/

function setLeft(speed) {
  pwm.setPWM(left_channel, 0, parseInt(speed));
}

function setRight(speed) {
  pwm.setPWM(right_channel, 0, parseInt(speed));
}

var setMotors = function(diffSteer) {
  setLeft(diffSteer.leftSpeed);
  setRight(diffSteer.rightSpeed);
};

/**
 * Function to be called from rover Server to send proper signals to motors.
 * @param {JSON} joystickData.  JSON joystick axis and value data.
 */
/*var receiveMobility = function(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.number);
    let value = parseInt(joystickData.value);
    var diffSteer;
    // X-Axis
    if (axis === 1) {
        diffSteer = steerMotors(null, value.map(-32767, 32767, -1, 1), lastY);
        lastX = value.map(32767, -32767, -1, 1);
    }
    // Y-Axis SWAPPED MIN=1 MAX=-1 FOR INPUT AND OUTPUT FOR MAP
    else if (axis === 0) {
        diffSteer = steerMotors(null, lastX, value.map(32767, -32767, 1, -1));
        lastY = value.map(32767, -32767, 1, -1);
    }
    //console.log("DS0");
    //console.log(diffSteer[0]);
    //console.log("DS1");
    //console.log(diffSteer[1]);

    // Have left and right signal go to two pins
    setMotors(diffSteer[0], leftFront_channel);
    setMotors(diffSteer[0], leftBack_channel);
    setMotors(diffSteer[1], rightFront_channel);
    setMotors(diffSteer[1], rightBack_channel);
};*/

function calculateDiff(xAxis, yAxis) {
  xAxis = xAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);
  yAxis = yAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);

  xAxis = xAxis * -1;

  var V = (100 - Math.abs(xAxis)) * (yAxis / 100.0) + yAxis;
  var W = (100 - Math.abs(yAxis)) * (xAxis / 100.0) + xAxis;
  var right = (V + W) / 2.0;
  var left = (V - W) / 2.0;

  if(right <= 0) {
    right = right.map(-100, 0, servo_min, servo_mid);
  }
  else {
    right = right.map(0, 100, servo_mid, servo_max);
  }

  if (left <= 0) {
    left = left.map(-100, 0, servo_min, servo_mid);
  }
  else {
    left = left.map(0, 100, servo_mid, servo_max);
  }

  return {
    "leftSpeed": left,
    "rightSpeed": right
  };
}

var receiveMobility = function(joystickData) {
    // This function assumes that it is receiving correct JSON.  It does not check JSON comming in.
    let axis = parseInt(joystickData.number);
    let value = parseInt(joystickData.value);

    var diffSteer;

    // X axis
    if(axis === 0) {
      diffSteer = calculateDiff(value, lastY);
      lastX = value;
    }
    // Y axis
    else if(axis === 1) {
      diffSteer = calculateDiff(lastX, value);
      lastY = value;
    }

    setMotors(diffSteer);
};

// Send 0 to both the x and y axis to stop the rover from running
// Will only be invoked if we lose signal
function stopRover() {
    receiveMobility(zeroMessage[0]);
    receiveMobility(zeroMessage[1]);
}

function sendHome(msg) {
    server.send(msg, 0, msg.length, HOME_PORT, HOME_HOST, function(err) {
        if (err) {
            console.log("Problem with sending data!!!");
        } else {
            //console.log("Sent the data!!!")
        }
    });
}


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

    console.log("Control Message with type: " + message.type);

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


server.on('listening', function() {
    var address = server.address();
    console.log('Rover running on: ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote) {

    var msg = JSON.parse(message);
    //console.log(msg.commandType);
    switch (msg.commandType) {
        case 'mobility':
            receiveMobility(msg);
            break;
        case 'control':
            handleControl(msg);
        default:
            //console.log("###### Could not find commandType #######");
    }
});

server.bind(PORT);

//joystick.on('axis', onJoystickData);
/*
// Start the server
server.listen(PORT, function() {
	console.log("============ Server is up and running on port: ", server.address().port, "=============");
});

// parse application/json
app.use(bodyParser.json());

// Accept the command
app.use('/command', function(req, res, next) {
	next();
});


// Will accept the command and relay to process
app.post('/command', function(req, res, next) {
	var request = req.body;

	// Will return OK if everything is fine
	var statusCode = 200;

	// Find out what this command should do
	switch(request.commandType) {

			case 'mobility':
				// Either fork another process or just run code here
				receiveMobility(request);
				break;
			case 'arm':
				// Do arm stuff
				break;
			default:
				// We did not recognize that commmand send error code
				console.log("###### Could not find commandType ######");
				statusCode = 404;
	}

	res.sendStatus(statusCode);
});

*/

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
    // some other closing procedures go here
    process.exit();
});
