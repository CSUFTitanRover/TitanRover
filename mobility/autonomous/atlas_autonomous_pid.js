var sys = require('util');
var spawn = require("child_process").spawn;
var python_proc = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);

//----VARIABLES----

//FOR OFF ROVER TESTING:
//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched, written from the IMU
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data
var previous_heading_delta; //leave untouched

//THEN COMMENT THIS OUT
//DRIVE-CONSTANTS: 
var turning_drive_constant = 0; 
var forward_drive_constant = 50;

//DEGREES OF ERROR
var turning_drive_error = 20;//within 20 degrees stop turn
var forward_drive_error = 4; //within 4 degrees drive straight

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

var turn_counter = 0;//initialize counter for testing purposes
var maxTurnCounter = 500; //max value the turn counter can achieve
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
    //right_side_arr[1] = parseInt(speed + 127);

    //console.log(left_side_buff);
    console.log(left_side_arr);
    console.log(left_side_buff);
    port.write(left_side_buff);
    //port.write(right_side_buff)
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
    console.log(right_side_arr);
    console.log(right_side_buff);
    port.write(right_side_buff);
}

function driveForward(leftSideThrottle, rightSideThrottle) {
    setLeftSide(rightSideThrottle); 
    setRightSide(leftSideThrottle);
}

function stopRover() {
    driveForward(0, 0); //calls drive forward zeroed out
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
    clearInterval(pid_timer);
    clearInterval(turn_timer);
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
    clear_interval(pid_timer);
    clearInterval(turn_timer);
    clearInterval(drive_timer);
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
    //exit 
    clear_interval(pid_timer);
    clearInterval(turn_timer);
    clearInterval(drive_timer);
    stopRover();
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
}

var rover_autonomous_pid = function() {
    //TODO - WAYPOINT HANDLING
    //TODO - CALCULATE DISTNACE SO SPIT US BACK A MODIFIER TO BE INCLUDED IN THROTTLE CALCULATIONS
    console.log('----rover_autonomous_pid----')
    pid_timer = setInterval(function() {
        pidCounter++; 
        if (pidCounter > maxPidCounter) {
            clearInterval(pid_timer);
        }
        if (!isDriving || !isTurning) {
            calc_heading_delta();
            if (Math.abs(heading_delta) > turning_drive_error) {
                isTurning = true;
                console.log('----turningP----')
                //----TURNINGP TIMER----
                turn_timer = setInterval(function() {
                    //FOR TESTING OFF ROVER
                    turnCounter++;
                    //current_heading--;
                    //---------------------
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log("Turning left:" + turning_left);
                    console.log("Turning right:" + turning_right);
                    if (Math.abs(heading_delta) <= acceptable_Degree_Error) {
                        clearInterval(turn_timer);
                        stopRover();
                        console.log('----FOUND HEADING----');
                        console.log('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
                        doneTurning = true;
                    } else {
                        //Calculate the throttle percentage change based on what the proportion is.
                        throttlePercentageChange = heading_delta/180
                        throttlePercentageChange = heading_delta/180;
                        console.log('turning_left: ' + turning_left);
                        console.log('turning_right:' + turning_right);
                        if(turning_right){
                                console.log('Slowing turning right');
                                leftThrottle = drive_constant + Math.round(throttle_max * throttlePercentageChange * 2);
                                rightThrottle = drive_constant + Math.round(throttle_min * throttlePercentageChange * 2);
                        }else if(turning_left){
                                console.log('Slowing turning left');
                                leftThrottle = drive_constant + Math.round(throttle_min * throttlePercentageChange * 2);
                                rightThrottle = drive_constant + Math.round(throttle_max * throttlePercentageChange * 2);
                        } else {
                            console.log('ERROR - Cannot slowly turn left or right');
                        }
                    }
                    //Checks to see if the currentThrottle values are valid for mechanical input as it is possible that the values can be significantly more or
                    //less than throttle_min and throttle_max. Then sets the rover speed to the calculated value
                    if (!doneTurning) {
                        if (leftThrottle < throttle_max && leftThrottle > throttle_min &&  rightThrottle < throttle_max && rightThrottle > throttle_min){
                            //rover.set_speed(Math.trunc(leftThrottle), Math.trunc(rightThrottle));
                            driveForward(leftThrottle, rightThrottle);
                            //PUT SET SPEED IN HERE.
                            previousleftThrottle = leftThrottle;
                            previousrightThrottle = rightThrottle;
                            console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                        } else {
                            //In a later implementtion I want to call turn.js, as if we're trying to adjust this far we're way off on our heading. 
                            console.log('Throttle Value outside of motor range');
                            //checks the leftThrottle values to make sure they're within mechanical constraints
                            if (leftThrottle > throttle_max){
                                leftThrottle = throttle_max;
                            } else if (leftThrottle < throttle_min) {
                                leftThrottle = throttle_min;
                            } else {
                                console.log('ERROR - leftThrottle values undefined');
                                stopRover();
                                isTurning = false; 
                                clearInterval(turn_timer);
                            }

                            //checks the rightThrottle values to make sure they're within mechanical constraints
                            if (rightThrottle > throttle_max) {
                                rightThrottle = throttle_max;
                            } else if (rightThrottle < throttle_min) {
                                rightThrottle = throttle_min;
                            } else {
                                console.log('ERROR - rightThrottle values undefined');
                                isTurning = false;
                                stopRover();
                                clearInterval(turn_timer);
                            }
                            //PUT SET SPEED HERE AS WELL
                            driveForward(leftThrottle, rightThrottle);
                            console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                        }

                        if (turnCounter > maxTurnCounter) {
                            clearInterval(turn_timer);
                            stopRover();
                            isTurning = false;
                            console.log('REACHED MAX NUMBER OF CHANCES');
                        } else {
                            console.log("----EXECUTING TURN----");
                        }
                    } else if (doneTurning) {
                        isTurning = false;
                        clearInterval(turn_timer);
                        stopRover();
                    }
            },50);
            //----DONE TURNINGP----
        } else if (Math.abs(heading_delta) <= turning_drive_error) {
                isDriving = true; //boolean logic to make sure we don't stack timers uneccesarily
                console.log('----ForwardPmovement----')
                //----FORWARDP TIMER----
                drive_timer = setInterval(function() {
                    //FOR TESTING OFF ROVER
                    driveCounter++;
                    //current_heading--;
                    //---------------------
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log("Turning left:" + turning_left);
                    console.log("Turning right:" + turning_right);
                    if (Math.abs(heading_delta) <= forward_drive_error) {
                        leftThrottle = forward_drive_constant;
                        rightThrottle = forward_drive_constant;
                        console.log('Moving forward at drive constant');
                    } else {
                        //Calculate the throttle percentage change based on what the proportion is.
                        throttlePercentageChange = heading_delta/180
                        console.log('turning_left: ' + turning_left);
                        console.log('turning_right:' + turning_right);
                        if(turning_right){
                                console.log('Slowing turning right');
                                leftThrottle = forward_drive_constant + Math.round(forward_drive_constant * throttlePercentageChange);
                                rightThrottle = forward_drive_constant - Math.round(forward_drive_constant * throttlePercentageChange);
                        }else if(turning_left){
                                console.log('Slowing turning left');
                                leftThrottle = forward_drive_constant - Math.round(forward_drive_constant * throttlePercentageChange);
                                rightThrottle = forward_drive_constant + Math.round(forward_drive_constant * throttlePercentageChange);
                        } else {
                            console.log('ERROR - Cannot slowly turn left or right');
                        }
                    }
                    //Checks to see if the currentThrottle values are valid for mechanical input as it is possible that the values can be significantly more or
                    //less than throttle_min and throttle_max. Then sets the rover speed to the calculated value

                    if (leftThrottle <= throttle_max && leftThrottle >= throttle_min &&  rightThrottle <= throttle_max && rightThrottle >= throttle_min){
                        //rover.set_speed(Math.trunc(leftThrottle), Math.trunc(rightThrottle));
                        driveForward(leftThrottle, rightThrottle);
                        //PUT SET SPEED IN HERE.
                        previousleftThrottle = leftThrottle;
                        previousrightThrottle = rightThrottle;
                        console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                    } else {
                        //In a later implementtion I want to call turn.js, as if we're trying to adjust this far we're way off on our heading. 
                        console.log('Throttle Value outside of motor range');
                        console.log("Unfixed LeftThrottle:" + leftThrottle);
                        console.log("Unfixed RightThrottle: " + rightThrottle);
                        //checks the leftThrottle values to make sure they're within mechanical constraints
                        if (leftThrottle > throttle_max){
                            leftThrottle = throttle_max;
                        } else if (leftThrottle < throttle_min) {
                            leftThrottle = throttle_min;
                        } else if (leftThrottle <= throttle_max && leftThrottle >= throttle_min) {
                        console.log("LEFT THROTTLE OKAY"); 
                        } else {
                            console.log('ERROR - leftThrottle values undefined');
                            stopRover();
                            isDriving = false;
                            clearInterval(drive_timer);
                        }

                        //checks the rightThrottle values to make sure they're within mechanical constraints
                        if (rightThrottle > throttle_max) {
                            rightThrottle = throttle_max;
                        } else if (rightThrottle < throttle_min) {
                            rightThrottle = throttle_min;
                        } else if (rightThrottle <= throttle_max && rightThrottle >= throttle_min) {
                            console.log("RIGHT THROTTLE OK");
                        } else {
                            console.log('ERROR - rightThrottle values undefined');
                            stopRover();
                            isDriving = false;
                            clearInterval(drive_timer);
                        }
                        //PUT SET SPEED HERE AS WELL
                        driveForward(leftThrottle, rightThrottle);
                        console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                    }

                    if (driveCounter > maxDriveCounter) {
                        clearInterval(drive_timer);
                        stopRover();
                        isDriving = false;
                        console.log('----REACHED THE END OF LOOP----');
                    } else {
                        console.log('Thottle Adjusted');
                    }
                },50);
                //----END FORWARDP----
            }
        } else {
            console.log("ERROR - HEADING NOT WITHIN VALID RANGE");
            console.log("Heading Delta: " + heading_delta);
            clearInterval(pid_timer);
        }
    },50);
}

//Shan's Get heading calc based on logic Shan and Brandon came up with to determine which direction the rover will be turning
//IE: Is turning left or right the shorter turn?
function calc_heading_delta(){
    console.log('Calculating Heading Delta & Direction');
    temp_delta = current_heading - target_heading;
    console.log('temp_delta: ' + temp_delta);
    if(current_heading > target_heading){
        if(Math.abs(temp_delta) > 180){
            // If we were turning left previously or have never turned right before
            if(turning_left || turning_right === null){
                console.log('turning right: '+ current_heading);
                turning_right = true;
                turning_left = false;
            }
            heading_delta = 360 - current_heading + target_heading;
        }else{
              // If we were turning right previously or have never turned left before
             if(turning_right || turning_left === null){
                console.log('turning left: '+ current_heading);
                turning_left = true;
                turning_right = false;
            }
            heading_delta = current_heading - target_heading;
            }
    }else{
        if(Math.abs(temp_delta) > 180){ 
             if(turning_right || turning_left === null){
                console.log('turning left: '+ current_heading);
                turning_left = true;
                turning_right = false;
            }
            heading_delta = 360 - target_heading + current_heading;
        }else{
            if(turning_left || turning_right === null){
                console.log('turning right: '+ current_heading);
                turning_right = true;
                turning_left = false;
            }
            heading_delta = target_heading - current_heading;
        }
    } 
}