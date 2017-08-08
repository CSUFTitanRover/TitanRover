var sys = require('util');
var sleep = require('sleep');
var spawn = require("child_process").spawn;

//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched, written from the IMU
var previous_current_heading;
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data
var previous_heading_delta; //leave untouched
var magneticDeclination = 12; //12.3 in Fullerton, 15 in Hanksville
var python_proc = spawn('python',["/home/pi/TitanRover/GPS/IMU/Python_Version/IMU_Acc_Mag_Gyro.py", magneticDeclination]);

//THEN COMMENT THIS OUT
//DRIVE-CONSTANTS: 
var turning_drive_constant = 25; 

//DEGREES OF ERROR
var turning_drive_error = 5//within 20 degrees stop turn

//THROTTLE LOGIC
var throttle_min = 25; //Minimum throttle value acceptable
var throttle_max = 35; //Maximum throttle value acceptable
var leftThrottle;
var rightThrottle;
var previousrightThrottle;
var previousleftThrottle;
var throttlePercentageChange;

//BOOLEAN LOGIC FOR FUNCTIONS
var doneTurning = false;
var turning_right = null;
var currentHeadingValid = false;

var turnCounter = 0;//initialize counter for testing purposes
var maxTurnCounter = 5000; //max value the turn counter can achieve
var invalidHeadingCounter = 0;
var invalidHeadingCounterMax = 40;

/************************* Connect to Showcase UI *************************/ 
var app = require('express');
var socket = require('http').Server(app);
var io = require('socket.io')(socket);


// Start the server
socket.listen(6993, function() {
    console.log("============ Server is up and running on port: ", socket.address().port, "=============");
});


// Socket.io is going to be handling all the emits events that the UI needs.
io.on('connection', function(socketClient) {
    console.log("Client Connected: " + socketClient.id);
    socketClient.on('new angle value', function(newAngle) {
        target_heading = newAngle;
        clearInterval(turn_timer);
        stopRover(); 
        turningP();
    });

});
/************************* Connect to Showcase UI *************************/ 

// Get heading,calculate heading and turn immediately.
python_proc.stdout.on('data', function (data){
    current_heading = parseFloat(data);;
});

//-------ROVERCONTROL------
var serialPort = require('serialport');
var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.readline('\n')
});

var left_side_arr = new Uint16Array(3);
left_side_arr[0] = 0xB;
left_side_arr[2] = 0xbbaa;
var left_side_buff = Buffer.from(left_side_arr.buffer);

var right_side_arr = new Uint16Array(3);
right_side_arr[0] = 0xC;
right_side_arr[2] = 0xbbaa;
var right_side_buff = Buffer.from(right_side_arr.buffer);

var time = new Date();
var timer;
function setLeftSide(leftSpeed) {
    //leftSpeed = leftSpeed*-1;
    if (leftSpeed < -127 || leftSpeed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('Y: ' + leftSpeed );
    // Since we are using unsigened ints for serial make it between 0 and 254
    leftSpeed = leftSpeed + 127;
    parseInt(leftSpeed);
    left_side_arr[1] = leftSpeed;
    //onsole.log(left_side_arr);
    //console.log(left_side_buff);
    port.write(left_side_buff);
}

function setRightSide(rightSpeed) {
    //rightSpeed = rightSpeed*-1;
    if (rightSpeed < -127 || rightSpeed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('x: ' + rightSpeed);
    // Since we are using unsigned ints for serial make it between 0 and 254
    rightSpeed = rightSpeed + 127;
    parseInt(rightSpeed);
    right_side_arr[1] = rightSpeed;
    //console.log(right_side_arr);
    //console.log(right_side_buff);
    port.write(right_side_buff);
}

function setMotors(leftSideThrottle, rightSideThrottle) {
    setLeftSide(leftSideThrottle); 
    setRightSide(rightSideThrottle);
}

function stopRover() {
    setMotors(0, 0); //calls drive forward zeroed out
}
// Any serial data from the arduino will be sent back home
// and printed to the console
port.on('data', function(data) {
    console.log('ArduinoMessage: ' + data);
    var jsonBuilder = {};
    jsonBuilder.ArduinoMessage = data;
    jsonBuilder.type = 'debug';
    //ssendHome(jsonBuilder);
});

port.on('open',function(){
    console.log('open');
    //setTimeout(main,1000);
});

//LOGIC TO KILL ALL PROCESS AND STOP ROVER MID SCRIPT
process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    clearInterval(turn_timer);
    stopRover();  
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});

process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    clearInterval(turn_timer);
    stopRover();
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});
//----END SCRIPT KILL----
//----END ROVER CONTROL----

// Main Function
setTimeout(main,3000);//Necesary block for the serial port to open with the arduino
function main() {
    clearInterval(main);
    turningP();
}

var turningP = function() {
    console.log('----turningP----')
    turn_timer = setInterval(function() {
        //FOR TESTING OFF ROVER
        turnCounter++;
        //current_heading--;
        //---------------------
        doneTurning = false;
        calc_heading_delta();
        output_nav_data();
        if (isNaN(current_heading)) {
            console.log("Current Heading is NaN");
            stopRover();
            doneTurning = true;
            clearInterval(turn_timer);
        } else if (current_heading == false) {
            console.log("Current Heading is false");
            stopRover();
            doneTurning = true;
            clearInterval(turn_timer);
        } else if (current_heading == previous_current_heading) {
            invalidHeadingCounter++
            if (invalidHeadingCounterMax <= invalidHeadingCounter) {
                console.log("Current Heading is the same" + invalidHeadingCounterMax + "iterations");
                stopRover();
                doneTurning = true;
                clearInterval(turn_timer);
            }
        } else {
            invalidHeadingCounter = 0;
            if (Math.abs(heading_delta) <= turning_drive_error) {
                isTurning = false;
                clearInterval(turn_timer);
                stopRover();
                io.emit('enable knob');
                console.log('----FOUND HEADING----');
                console.log('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
                doneTurning = true;
            } else {
                //Calculate the throttle percentage change based on what the proportion is.
                headingModifier = heading_delta/180;
                let temp_throttle; 
                console.log('!turn_right: ' + !turn_right);
                console.log('turn_right:' + turn_right);
                
                temp_throttle = (throttle_min + (Math.round(throttle_max * headingModifier)));
                temp_throttle = temp_throttle.clamp(throttle_min,throttle_max);
                console.log("temp_throttle" + temp_throttle);
                if(turn_right){
                        console.log('Slowing turning right');
                        leftThrottle = temp_throttle;
                        rightThrottle = temp_throttle * -1; // removed temp_throttle - 10
                }else{
                        console.log('Slowing turning left');
                        rightThrottle = temp_throttle;
                        leftThrottle = temp_throttle * -1;
                } 
            }
        //Checks to see if the currentThrottle values are valid for mechanical input as it is possible that the values can be significantly more or
        //less than throttle_min and throttle_max. Then sets the rover speed to the calculated value
        }
        if (!doneTurning) {  
            setMotors(leftThrottle, rightThrottle);
            previous_current_heading = current_heading;
            console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
            //checks the rightThrottle values to make sure they're within mechanical constraints
        } else if (doneTurning) {
            console.log("----DONE TURNING----")
        }
    },100);
}

function calc_heading_delta(){
    console.log('Calculating Heading Delta & Direction');
    let abs_delta = Math.abs(current_heading - target_heading);
    // xnor operation also note (!turn_right = turn_left)
    turn_right = current_heading > target_heading === abs_delta > 180; 
    heading_delta = abs_delta <= 180 ? abs_delta : 360 - abs_delta;
    
    if(heading_delta > 360 || heading_delta < 0){
        throw new RangeError('Heading must be between 0 and 360. Magnetometer probably sent a bad value');
    }
}

function output_nav_data() {
    console.log("Current Heading: " + current_heading);
    console.log("Previous Heading: " + previous_current_heading);
    console.log("Target Heading: " + target_heading);
    console.log("Heading Delta: " + heading_delta)
    console.log("Turning left:" + !turn_right);
    console.log("Turning right:" + turn_right);
};


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  console.log("clamp: " + Math.min(Math.max(this, min), max));
  return Math.min(Math.max(this, min), max);
};