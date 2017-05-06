var sys = require('util');
var spawn = require("child_process").spawn;
var python_proc = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);

//----VARIABLES----

//FOR OFF ROVER TESTING:
//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched, written from the IMU
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data
var previous_heading_delta; //leave untouched
var distanceModifier = 1; // ***** TEMPORARY ******* 
//THEN COMMENT THIS OUT
//DRIVE-CONSTANTS: 
var turning_drive_constant = 0; 
var forward_drive_constant = 75;

//DEGREES OF ERROR
var turning_drive_error = 20;//within 20 degrees stop turn
var forward_drive_error = 3; //within 4 degrees drive straight

//THROTTLE LOGIC
var throttle_min = -127; //Minimum throttle value acceptable
var throttle_max = 127; //Maximum throttle value acceptable
var leftThrottle;
var rightThrottle;
var previousrightThrottle;
var previousleftThrottle;
var throttlePercentageChange;

//BOOLEAN LOGIC FOR FUNCTIONS
var doneTurning = false;
var turning_left = null;
var turning_right = null;
var isTurning = false;
var isDriving = false; 

var turnCounter = 0;//initialize counter for testing purposes
var maxTurnCounter = 1000; //max value the turn counter can achieve
var driveCounter = 0;//initialize counter for testing purposes
var maxDriveCounter = 500; //max value the counter can achienve
var pidCounter = 0;//initialize counter for testing purposes
var maxPidCounter = 1000;//max value the counter can achienve

//----GRAB DATA FROM IMU----
python_proc.stdout.on('data', function (data){
    current_heading = parseFloat(data);
});

//INCLUDED FOR CONTROL OF THE ROVER WITH UPDATED SERIAL COMMUNICATION
//-------ROVERCONTROL------
var serialPort = require('serialport');
var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.readline('\n')
});

var right_side_arr = new Uint16Array(3);
right_side_arr[0] = 0xB;
right_side_arr[2] = 0xbbaa;
var right_side_buff = Buffer.from(right_side_arr.buffer);

var left_side_arr = new Uint16Array(3);
left_side_arr[0] = 0xC;
left_side_arr[2] = 0xbbaa;
var left_side_buff = Buffer.from(left_side_arr.buffer);

var time = new Date();
var timer;
function setLeftSide(leftSpeed) {
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
    setLeftSide(rightSideThrottle); 
    setRightSide(leftSideThrottle);
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

process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    if (isPID) {
        clearInterval(pid_timer);
    }
    if (isTurning) {
        clearInterval(turn_timer);
    }
    if (isDriving) {
        clearInterval(drive_timer);
    }
    stopRover();  
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});

process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    if (isPID) {
        clearInterval(pid_timer);
    }
    if (isTurning) {
        clearInterval(turn_timer);
    }
    if (isDriving) {
        clearInterval(drive_timer);
    }
    stopRover();
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});
//----END SCRIPT KILL----
//----END ROVER CONTROL----

setTimeout(main,3000);//Necesary block for the serial port to open with the arduino
function main() {
    clearInterval(main);
    rover_autonomous_pid();
}

var rover_autonomous_pid = function() {
    //TODO - WAYPOINT HANDLING
    //TODO - CALCULATE DISTNACE SO SPIT US BACK A MODIFIER TO BE INCLUDED IN THROTTLE CALCULATIONS
    console.log('----rover_autonomous_pid----')
    pid_timer = setInterval(function() {
        isPID = true;
        console.log("----PID TIMER----")
        console.log("Driving: " + isDriving + "Turning: " + isTurning);
        pidCounter++; 
        if (pidCounter > maxPidCounter) {
            console.log("----REACHEAD MAXIMUM NUMBER OF CHANCES----");
            clearInterval(pid_timer);
        }
        if (!isDriving && !isTurning) {
            //pathfinder(); //gets distance and target heading
            calc_heading_delta();
            output_nav_data();
            if (Math.abs(heading_delta) > turning_drive_error) {
                isTurning = true;
                doneTurning = false;
                console.log('----turningP----');
                //----TURNINGP TIMER----
                turn_timer = setInterval(function() {
                    //FOR TESTING OFF ROVER
                    turnCounter++;
                    //current_heading--;
                    //---------------------
                    calc_heading_delta();

                    if (Math.abs(heading_delta) <= turning_drive_error) {
                        isTurning = false;
                        clearInterval(turn_timer);
                        //stopRover();
                        console.log('----FOUND HEADING----');
                        console.log('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
                        doneTurning = true;
                    } else {
                        //Calculate the throttle percentage change based on what the proportion is.
                        headingModifier = heading_delta/180;
                        let temp_throttle; 
                        console.log('!turn_right: ' + !turn_right);
                        console.log('turn_right:' + turn_right);
                        
                        temp_throttle = (turning_drive_constant + (Math.round(throttle_max * headingModifier))).clamp(throttle_min,throttle_max);
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
                    if (!doneTurning) {  
                        setMotors(leftThrottle, rightThrottle);
                        console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                        //checks the rightThrottle values to make sure they're within mechanical constraints
                        if (turnCounter > maxTurnCounter) {
                            clearInterval(turn_timer);
                            isTurning = false;
                            stopRover();
                            console.log('REACHED MAX NUMBER OF CHANCES');
                        } else {
                            console.log("----EXECUTING TURN----");
                        }
                    } else if (doneTurning) {
                        console.log("----DONE TURNING----")
                    }
                },50);
            //----DONE TURNINGP----
            console.log("Done Turning");
        } else if (Math.abs(heading_delta) <= turning_drive_error) {
                isDriving = true; //boolean logic to make sure we don't stack timers uneccesarily
                console.log('----ForwardPmovement----')
                //----FORWARDP TIMER----
                drive_timer = setInterval(function() {
                    driveCounter++;//for testing purposes only.
                    //pathfinder(); //gets distance, distanceModifier modifier and target heading
                    calc_heading_delta(); //calculates best turn towards target heading
                    output_nav_data();
                    if (Math.abs(heading_delta) <= forward_drive_error) {
                        leftThrottle = (forward_drive_constant + forward_drive_modifier) * distanceModifier;
                        rightThrottle = (forward_drive_constant + forward_drive_modifier) * distanceModifier;
                        console.log('Moving forward at drive constant');
                    } else {
                        //Calculate the throttle percentage change based on what the proportion is.
                        headingModifier = heading_delta / 180;
                        console.log('!turn_right: ' + !turn_right);
                        console.log('turn_right:' + turn_right);
                        var throttle_offset = Math.round(forward_drive_constant * headingModifier* Math.log(heading_delta) * distanceModifier);
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
                        isDriving = false;
                        clearInterval(drive_timer);
                        //stopRover();
                    }
                    if(driveCounter > maxDriveCounter) {
                        clearInterval(drive_timer);
                        stopRover();
                        isDriving = false;
                        console.log('----REACHED THE END OF LOOP----');
                    } else {
                        console.log('Thottle Adjusted');
                    }
                },50); // end of drive timer
                //----END FORWARDP----
                console.log("Done driving forward");
            } 
        }
        console.log("----CONTINUING----")
    },200); // end of PID timer 
}

//Shan's Get heading calc based on logic Shan and Brandon came up with to determine which direction the rover will be turning
//IE: Is turning left or right the shorter turn?
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

//uses geolib to get distance and targetHeading. 
// function pathfinder() {
//     //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
//     distance = geolib.getDistance(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1],1,5);
//     distance = geolib.convertUnit('cm',distance);
//     //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
//     target_heading = geolib.getBearing(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1]);
//     console.log("Current Distance: " + distance);
//     console.log("Target Heading:" + target_heading);

//     if (distance <= onTargetRange) {
//         distanceModifier = distance/onTargetRange;
//         console.log("distanceModifier Modifier: " + distanceModifier);
//     } else {
//         distanceModifier = 1;
//     }
// }

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