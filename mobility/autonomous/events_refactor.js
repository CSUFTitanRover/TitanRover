var sys = require('util');
var fs = require('fs');
var geolib = require('geolib');
var spawn = require("child_process").spawn;
var python_proc = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);

/*----TODO----
-Implement a check to see whether or not we need to grab data from the IMU at that moment, don't want to overwrite geolibs more acurate calculation
-Test distanceModifier to make sure we don't stop halfway to onTargetRange
-Add reach current GPS location and a way to implement waypoints.
*/

//----VARIABLES----

//FOR OFF ROVER TESTING:
//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched, written from the IMU
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data

// Timers
var turn_timer; 
var drive_timer;

var distance;          // distance to next waypoint
var onTargetRange = 5; // in meters, distance we want to start to modify the drive throttle to slow the rover down as we approach a waypoint
onTargetRange = geolib.convertUnit('cm',onTargetRange); // immediately convert from meters to cm for comparisons.

//DRIVE-CONSTANTS: 
var turning_drive_constant = 53; 
var forward_drive_constant = 45;
var forward_drive_modifier = 0; //to modify when driving straight forward

//DEGREES OF ERROR
var turning_drive_error = 10;         // within 20 degrees stop turn
var forward_drive_to_turn_error = 15; //logic to exit forwardP and turn. 
var forward_drive_error = 3;          //within 4 degrees drive straight

//THROTTLE LOGIC
var throttle_min = 30;      // Minimum throttle value to move the rover
var throttle_max = 70;      // Maximum throttle value acceptable
var proportional_error;        // heading ratio, used as modifer for throttle
var distanceModifier;       // distance ratio, used as modifer for throttle
var distanceThreshold = 20; // We need to be within x cm of target to move on 
var current_wayPoint = -1;  // -1 because index is incremented immediately; 

// BOOLEAN LOGIC FOR FUNCTIONS
var turn_right = null;

// ** SYNCHRONOUS READ **  Reading waypoints from file 

var filename = 'waypoints.json'; // Filename for gps waypoints
var wayPoints = JSON.parse(fs.readFileSync(filename, 'utf8'));

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const atlas = new MyEmitter();

atlas.on('get_waypoint',function(){
    current_wayPoint++; 
    if(current_wayPoint >= wayPoints.length()){
       stopRover();
       console.log("reached end of waypoints");
    }
    else{
        atlas.emit('turn');
    }
})

atlas.on('turn',function(){
    let temp_throttle; 
    let leftThrottle;
    let rightThrottle; 
    console.log('---- turning ----')
    calc_heading_delta();
    output_nav_data();
    
    /*
        Timer Start Condition: 
            Triggered upon drive event completion
            OR called by the get_waypoint event

        Timer Stop Condition: 
            If current heading is within nominal range of target heading
    */
    turn_timer = setInterval(function() {
        calc_heading_delta();
        console.log('turn_right:' + turn_right);
            
        if (Math.abs(heading_delta) <= turning_drive_error) {
            clearInterval(turn_timer);
            //stopRover();
            console.log('----FOUND HEADING----');
            console.log('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
            atlas.emit('drive');
        } else {
            // proportional error with respect to heading
            proportional_error = heading_delta / 180;
            temp_throttle = Math.round(throttle_max * proportional_error)
            temp_throttle = (turning_drive_constant + temp_throttle).clamp(throttle_min,throttle_max);
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
        // sets the rover speed to the calculated value
        setMotors(leftThrottle, rightThrottle);
        console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
    }, 50); // end of turn timer
}) // end of turn event 


atlas.on('drive',function(){
    console.log('---- driving ----')
    let leftThrottle; 
    let rightThrottle; 
    let throttle_offset
    
    /*
        Timer Start Condition: 
            Triggered upon turn event completion
        Stop Conditions: 
            current heading exceeds error threshold or rover is within stopping distance of target.
    */
    drive_timer = setInterval(function() {
        pathfinder();           //gets distance, distanceModifier modifier and target heading
        calc_heading_delta();   //calculates best turn towards target heading
        output_nav_data();
        
        if (Math.abs(heading_delta > forward_drive_to_turn_error) || distance < distance_threshold ){
            clearInterval(drive_timer);
            stopRover(); 
            console.log("Done driving forward");     
            distance < distance_threshold ? atlas.emit('get_waypoint') : atlas.emit('turn');    
        }
        // If heading is nominal, drive forward
        else if (Math.abs(heading_delta) <= forward_drive_error) {
            leftThrottle  = forward_drive_constant;
            rightThrottle = forward_drive_constant;
            console.log('Moving forward at drive constant');
        } 
        // Adjust left and right throttle to maintain nominal heading
        else {
            // proportional error with respect to heading
            proportional_error = heading_delta / 180;
            console.log('!turn_right: ' + !turn_right);
            console.log('turn_right:' + turn_right);
            throttle_offset = Math.round(forward_drive_constant * proportional_error * Math.log(heading_delta));
            if(turn_right){
                console.log('Slowly turning right');
                leftThrottle = (forward_drive_constant + throttle_offset);
                rightThrottle = (forward_drive_constant - throttle_offset);
            }else{
                console.log('Slowly turning left');
                leftThrottle = forward_drive_constant - throttle_offset;
                rightThrottle = forward_drive_constant + throttle_offset;
            }
            leftThrottle = leftThrottle.clamp(forward_throttle_min, forward_throttle_min);
            rightThrottle = rightThrottle.clamp(forward_throttle_min, forward_throttle_min);
            setMotors(leftThrottle, rightThrottle);
            console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
        } 
    }, 50); // end of drive timer 
}) // end of drive event 

//----GRAB DATA FROM IMU----
python_proc.stdout.on('data', function (data){   
    let invalidHeadingCounter = 0;
    data = parseFloat(data);  

    if( 0 <= data && data <= 360){
        current_heading = data;
        invalidHeadingCounter = 0; 
    }  
    else{
        invalidHeadingCounter++;
    }
    
    // **** WARNING: ARBITRARY COUNTER LIMIT ****
    if(invalidHeadingCounter > 10){
        clearInterval(turn_timer);
        clearInterval(drive_timer);
        stopRover(); 
        console.log("Rover stopped because of bad heading data");
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
    rightSpeed = rightSpeed * -1;
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

// KILL ALL PROCESS AND STOP ROVER MID SCRIPT
process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
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
    clearInterval(turn_timer);
    clearInterval(drive_timer);
    stopRover();
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    }, 1000);
});
//----END SCRIPT KILL----
//----END ROVER CONTROL----

setTimeout(()=> atlas.emit('get_waypoint'), 3000); // Timeout used for the serial port to open with the arduino

//Shan's Get heading calc based on logic Shan and Brandon came up with to determine which direction the rover will be turning
//IE: Is turning left or right the shorter turn?
function calc_heading_delta(){
    console.log('Calculating Heading Delta & Direction');
    let abs_delta = Math.abs(current_heading - target_heading);
    // xnor operation also note (!turn_right = turn_left)
    turn_right = current_heading > target_heading === abs_delta > 180; 
    heading_delta = abs_delta <= 180 ? abs_delta : 360 - abs_delta;
}

//uses geolib to get distance and targetHeading. 
function pathfinder() {
    //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
    distance = geolib.getDistance(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1],1,5);
    distance = geolib.convertUnit('cm',distance);
    //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
    target_heading = geolib.getBearing(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1]);
    console.log("Current Distance: " + distance);
    console.log("Target Heading: " + target_heading);

    if (distance <= onTargetRange) {
        distanceModifier = distance / onTargetRange;
        console.log("distanceModifier Modifier: " + distanceModifier);
    } else {
        distanceModifier = 1;
    }
}

function output_nav_data() {
    console.log("Current Heading: " + current_heading);
    console.log("Target Heading: " + target_heading);
    console.log("Heading Delta: " + heading_delta);
    console.log("Turning right: " + turn_right);
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