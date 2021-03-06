var sys = require('util');
var geolib = require('geolib');
var spawn = require("child_process").spawn;

//Target Waypoint
var target_gps_location = {
    //latitude:,
    //longitude:,
};
//---

//TIMS REACH SERVER INFO
var net = require('net');
var fs = require("fs");
var jsonfile = require('jsonfile');
var previous_gps_packet;

var file = '/home/pi/TitanRover/mobility/runt/node/gps.json' ; 
var reachIP = '192.168.2.15';
var reach_shans_hotspot = '172.20.10.7';

var gpsJSON  = {
    'time': null,
    'latitude': null,
    'longitude': null 
};

var client = new net.Socket();
client.connect(9001, reachIP, function() {
	console.log('Connected to reach');
});

// When we get a data packet from the reach
client.on('data', function(data,err) { 
//	console.log(String(data));
    if(err){
        console.log("Error!: " + JSON.stringify(err));
    }
    /* Example data object from the reach stream 
        GPST latitude(deg) longitude(deg)  height(m)   Q  ns   sdn(m)   sde(m)   sdu(m)  sdne(m)  sdeu(m)  sdun(m) age(s)  ratio
        1934 433341.500   33.882028059 -117.882559268    38.7224   5   4   3.9905   3.7742   9.1639   2.7016   4.4366   4.2998   0.00    0.0
    */
    // Parse the data into an array
    data = data.toString().split(" ").filter(the_spaces);
    var current_gps_packet = {
            latitude: data[2],
            longitude: data[3],
        };
    //jsonfile.writeFileSync(file, gps_packet);
});

client.on('close', function() {
	console.log('Connection closed');
});

function the_spaces(value) {
  return value !== '';
}
//-----------

//----VARIABLES----

//FOR OFF ROVER TESTING:
//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched, written from the IMU
var previous_current_heading;
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data
var previous_heading_delta; //leave untouched
var magneticDeclination = 12; //12.3 in Fullerton, 15 in Hanksville
var python_proc = spawn('python',["/home/pi/TitanRover/GPS/IMU/Python_Version/IMU_Acc_Mag_Gyro.py", magneticDeclination]);

var distance; // distance to next waypoint
var onTargetRange = 5; // in meters, distance we want to start to modify the drive throttle to slow the rover down as we approach a waypoint
onTargetRange = geolib.convertUnit('cm',onTargetRange); // immediately convert from meters to cm for comparisons.
//THEN COMMENT THIS OUT
//DRIVE-CONSTANTS: 
var turning_drive_constant = 53; 
var forward_drive_constant = 45;
var forward_drive_modifier = 0; //to modify when driving straight forward

//DEGREES OF ERROR
var turning_drive_error = 10;//within 20 degrees stop turn
var forward_drive_to_turn_error = 15; //logic to exit forwardP and turn. 
var forward_drive_error = 3; //within 4 degrees drive straight

//THROTTLE LOGIC
var turning_throttle_min = 50; //Minimum throttle value acceptable
var turning_throttle_max = 90; //Maximum throttle value acceptable
var forward_throttle_min = 30; //Minimum throttle value acceptable
var forward_throttle_min = 110; //Maximum throttle value acceptable
var leftThrottle;
var rightThrottle;
var previousrightThrottle;
var previousleftThrottle;
var headingModifier; //heading ratio, used as modifer for throttle
var distanceModifier; //distance ratio, used as modifer for throttle
var throttlePercentageChange;

//BOOLEAN LOGIC FOR FUNCTIONS
var doneTurning = false;
var turn_right = null;
var isTurning = false;
var isDriving = false; 
var isPID = false;
var currentHeadingValid = false;

var pidCounter = 0;//initialize counter for testing purposes
var maxPidCounter = 1000;//max value the counter can achienve
var invalidHeadingCounter = 0;
var invalidHeadingCounterMax = 40;

//----GRAB DATA FROM IMU----
python_proc.stdout.on('data', function (data){
    data = parseFloat(data);
    if( 0 <= data && data <= 360){
         current_heading = data;
    }   
});

//INCLUDED FOR CONTROL OF THE ROVER WITH UPDATED SERIAL COMMUNICATION
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
            if (isTurning) {
                clearInterval(turn_timer);
            }
            if (isDriving) {
                clearInterval(drive_timer);
            }
            stopRover();
        }
        if (!isDriving && !isTurning) {
            pathfinder(); //gets distance and target heading
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
                            console.log('----FOUND HEADING----');
                            console.log('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
                            doneTurning = true;
                        } else {
                            //Calculate the throttle percentage change based on what the proportion is.
                            headingModifier = heading_delta/180;
                            let temp_throttle; 
                            console.log('!turn_right: ' + !turn_right);
                            console.log('turn_right:' + turn_right);
                            temp_throttle = (turning_throttle_min + (Math.round(turning_throttle_max * headingModifier)));
                            temp_throttle = temp_throttle.clamp(turning_throttle_min,turning_throttle_max);
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
                    }
                    //Checks to see if the currentThrottle values are valid for mechanical input as it is possible that the values can be significantly more or
                    //less than turning_throttle_min and turning_throttle_max. Then sets the rover speed to the calculated value
                    if (!doneTurning) {  
                        setMotors(leftThrottle, rightThrottle);
                        previous_current_heading = current_heading;
                        console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                        //checks the rightThrottle values to make sure they're within mechanical constraints
                    } else if (doneTurning) {
                        console.log("----DONE TURNING----")
                    }
                },100);
            //----DONE TURNINGP----
            console.log("Done Turning");
        } else if (Math.abs(heading_delta) <= turning_drive_error) {
                isDriving = true; //boolean logic to make sure we don't stack timers uneccesarily
                console.log('----ForwardPmovement----')
                //----FORWARDP TIMER----
                drive_timer = setInterval(function() {
                    pathfinder(); //gets distance, distanceModifier modifier and target heading
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
                        invalidHeadingCounter = 0;
                        if (Math.abs(heading_delta) <= forward_drive_error) {
                            leftThrottle = (forward_drive_constant);
                            rightThrottle = (forward_drive_constant);
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
                            leftThrottle = leftThrottle.clamp(forward_throttle_min, forward_throttle_min);
                            rightThrottle = rightThrottle.clamp(forward_throttle_min, forward_throttle_min);
                            setMotors(leftThrottle, rightThrottle);
                            //PUT SET SPEED IN HERE.
                            previousleftThrottle = leftThrottle;
                            previousrightThrottle = rightThrottle;
                            console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
                        } 
                        if (Math.abs(heading_delta) >= forward_drive_to_turn_error) { //if i'm past my max for forward P, clear interval and call turn.js
                            clearInterval(drive_timer);
                            //stopRover();
                        } else if (driveCounter >= maxDriveCounter) {
                            console.log("----Hit max iteration attemtps----")
                            clearInterval(drive_timer);
                            stopRover();
                        }
                    }
                },100);
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
function pathfinder() {
    //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
    if (geolib.getBearing(previous_gps_packet,current_gps_packet) < 20 ) {
            previous_gps_packet = current_gps_packet;
    }
    distance = geolib.getDistance(previous_gps_packet,target_gps_location);
    distance = geolib.convertUnit('cm',distance);
    //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
    target_heading = geolib.getBearing(previous_gps_packet,target_gps_location);
    console.log("Current Distance: " + distance);
    console.log("Target Heading:" + target_heading);

    if (distance <= onTargetRange) {
        distanceModifier = distance/onTargetRange;
        console.log("distanceModifier Modifier: " + distanceModifier);
    } else {
        distanceModifier = 1;
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