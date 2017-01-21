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
const servo_max = 409; // Calculated to be 2000 us

// PWM Channel Config:
const leftFront_channel = 0;
const rightFront_channel = 1;
const leftBack_channel = 2;
const rightBack_channel = 3;

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
/*var onJoystickData = function(event) {
    // X-Axis
    if (event.number === 0) {
        diffSteer = steerMotors(null, event.value.map(-35000, 35000, -1, 1), lastY);
        lastX = event.value.map(-35000, 35000, -1, 1);
    }
    // Y-Axis
    else if (event.number == 1) {
        diffSteer = steerMotors(null, lastX, event.value.map(-35000, 35000, -1, 1));
        lastY = event.value.map(-35000, 35000, -1, 1);
    }
    setMotors(diffSteer[0], left_channel);
    setMotors(diffSteer[1], right_channel);
};*/

/**
 * Function called on axis change from Joystick.  This function only responds to changes on X or Y, 
 number 0 or 1 respectively.  (1) Gets changed joystick value per X or Y Axis, (3) Calculate 
 differential steering by mappng joystick range to diff-steer range and stores the result in 
 lastX or last Y depending on axis changed, (4) Send values with proper channels to send values
 to motors.
  * @param {Int} channel.  Value described by left_channel or right_channel corresponding to pin outs
  * @param {JSON} diffSteer.  Differntial steering calculations for one side described by channel
 */
var setMotors = function(diffSteer, channel) {
    if (diffSteer.direction === 'rev') {
        pwm.setPWM(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_max)));
    } else {
        pwm.setPWM(channel, 0, parseInt(diffSteer.speed.map(0, 255, servo_mid, servo_min)));
    }
};

/**
 * Function to be called from rover Server to send proper signals to motors.
  * @param {JSON} joystickData.  JSON joystick axis and value data.
 */
var receiveMobility = function(joystickData){
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
};


server.on('listening', function() {
    var address = server.address();
    console.log('Rover running on: ' + address.address);
});

server.on('message', function(message, remote) {

    var msg = JSON.parse(message);
    console.log(msg.commandTyoe);
    switch(msg.commandTyoe) {
	case 'mobility':
		receiveMobility(msg);
		break;
	default:
		console.log("###### Could not find commandType #######");
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

// On SIGINT shutdown the server
process.on('SIGINT', function() {
	console.log("\n####### Should not have pressed that!! #######\n");
	console.log("###### Deleting all files now!!! ######\n");
	console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
	// some other closing procedures go here
	process.exit( );
});
