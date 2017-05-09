var sys = require('util');
var spawn = require("child_process").spawn;

//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched, written from the IMU
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data
var previous_heading_delta; //leave untouched
var magneticDeclination = 12.3; //12.3 in Fullerton, 15 in Hanksville
var python_proc = spawn('python',["/home/pi/TitanRover/GPS/IMU/Python_Version/IMU_Acc_Mag_Gyro.py", magneticDeclination]);

//THEN COMMENT THIS OUT
//DRIVE-CONSTANTS: 
var forward_drive_constant = 55;

//DEGREES OF ERROR
var forward_drive_error = 3; //within 4 degrees drive straight

//THROTTLE LOGIC
var throttle_min = 30; //Minimum throttle value acceptable
var throttle_max = 80; //Maximum throttle value acceptable
var leftThrottle;
var rightThrottle;
var previousrightThrottle;
var previousleftThrottle;
var throttlePercentageChange;

//BOOLEAN LOGIC FOR FUNCTIONS
var turning_right = null;

var driveCounter = 0;//initialize counter for testing purposes
var maxDriveCounter = 1000; //max value the counter can achienve

//----GRAB DATA FROM IMU----
python_proc.stdout.on('data', function (data){
    current_heading = parseFloat(data);
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
    leftSpeed = leftSpeed*-1;
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
    rightSpeed = rightSpeed*-1;
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
    clearInterval(drive_timer);
    stopRover();  
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});

process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    clearInterval(drive_timer);
    stopRover();
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});
//----END SCRIPT KILL----
//----END ROVER CONTROL----

//main function
setTimeout(main,3000); //Necesary block for the serial port to open with the arduino
function main() 
{
    clearTimeout(main);
    forwardPMovement();
    console.log("----BACK IN MAIN FUNCTION----")
    stopRover();
}

//Drives the rover forward and making any adjustments along the way.
var forwardPMovement = function() {
    console.log('----ForwardPmovement----')

    drive_timer = setInterval(function() {
        //FOR TESTING OFF ROVER
        driveCounter++;
        //current_heading--;
        //---------------------
        //pathfinder(); //gets distance, distanceModifier modifier and target heading
        calc_heading_delta(); //calculates best turn towards target heading
        output_nav_data();
        if (isNaN(current_heading)) {
            console.log("Current Heading is NaN");
            stopRover();
            clearInterval(drive_timer);
        } else if (current_heading == false) {
            console.log("Current Heading is false");
            stopRover();
            clearInterval(drive_timer);
        } else if (current_heading == previous_current_heading) {
            invalidHeadingCounter++
            if (invalidHeadingCounterMax <= invalidHeadingCounter) {
                console.log("Current Heading is the same" + invalidHeadingCounterMax + "iterations");
                stopRover();
                clearInterval(drive_timer);
            }
        } else {
            if (Math.abs(heading_delta) <= forward_drive_error) {
                leftThrottle = (forward_drive_constant + forward_drive_modifier);
                rightThrottle = (forward_drive_constant + forward_drive_modifier);
                console.log('Moving forward at drive constant');
            } else {
                //Calculate the throttle percentage change based on what the proportion is.
                headingModifier = heading_delta / 180;
                console.log('!turn_right: ' + !turn_right);
                console.log('turn_right:' + turn_right);
                var throttle_offset = Math.round(forward_drive_constant * headingModifier* Math.log(heading_delta));
                if(turn_right){
                        console.log('Slowing turning right');
                        leftThrottle = (forward_drive_constant + throttle_offset);
                        rightThrottle = (forward_drive_constant - throttle_offset);
                }else{
                        console.log('Slowing turning left');
                        leftThrottle = forward_drive_constant - throttle_offset;
                        rightThrottle = forward_drive_constant + throttle_offset;
                }    
                setMotors(leftThrottle.clamp(throttle_min, throttle_max), rightThrottle.clamp(throttle_min, throttle_max));
                //PUT SET SPEED IN HERE.
                previousleftThrottle = leftThrottle;
                previousrightThrottle = rightThrottle;
                console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
            } 
            if (Math.abs(heading_delta) >= forward_drive_to_turn_error) { //if i'm past my max for forward P, clear interval and call turn.js
                clearInterval(drive_timer);
                //stopRover();
            } else if (driveCounter <= driveCounterMax) {
                console.log("----Hit max iteration attemtps----")
                clearInterval(drive_timer);
                stopRover();
            }
        }
    },50);
}

//grabbed shan's calc_heading_delta() that we worked on together for the turning/heading logic
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
  return Math.min(Math.max(this, min), max);
};
