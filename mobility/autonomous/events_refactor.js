var sys = require('util');
var fs = require('fs');
var geolib = require('geolib');
var spawn = require("child_process").spawn;
var net = require('net');
var magneticDeclination = 0; //12.3 in Fullerton, 15 in Hanksville
var python_proc = spawn('python',["/home/pi/TitanRover/GPS/IMU/Python_Version/IMU_Acc_Mag_Gyro.py", magneticDeclination]);

var now = require('performance-now');
var Winston = require('winston');

const winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
          'colorize': true
          
     }),
      new (Winston.transports.File)({ 
          filename: './autonomous.log',
          options:{flags: 'w'}, // Overwrite logfile. Remove if you want to append 
          timestamp: function () {
          return now();},
     })
    ]
  });


/*----TODO----
-Test distanceModifier to make sure we don't stop halfway to onTargetRange
-In getwaypoints we need to mix the logic in for arriving at the final waypoiny to leave onTarget = true. Else we need to reset onTarget = false to allow for setMotors to execute on the timers. 
*/

//----VARIABLES----

//FOR OFF ROVER TESTING:
//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var current_heading; //leave untouched
var target_heading = 65; //change to desired target heading, will be replaced post calculation of GPS data
var imuHeading; //IMU Heading data to be overwritten by python process


// Timers
var turn_timer; 
var drive_timer;

var distance;          // distance to next waypoint
var onTargetRange = 5; // in meters, distance we want to start to modify the drive throttle to slow the rover down as we approach a waypoint
var onTargetError = 1; //distance we need to stop at a waypoint
onTargetRange = geolib.convertUnit('cm',onTargetRange); // immediately convert from meters to cm for comparisons.
onTargetError = geolib.convertUnit('cm',onTargetError);

//DRIVE-CONSTANTS: 
var turning_drive_constant = 90; 
var forward_drive_constant = 65;
var forward_drive_modifier = 0; //to modify when driving straight forward

//DEGREES OF ERROR
var turning_drive_error = 10;         // within 20 degrees stop turn
var forward_drive_to_turn_error = 10; //logic to exit forwardP and turn. 
var forward_drive_error = 3;          //within 4 degrees drive straight

//THROTTLE LOGIC
var throttle_min = 60;      // Minimum throttle value to move the rover
var throttle_max = 90;      // Maximum throttle value acceptable
var forward_throttle_min = 40; //Minimum throttle value acceptable
var forward_throttle_max = 90; //Maximum throttle value acceptable
var proportional_error;        // heading ratio, used as modifer for throttle
var distanceModifier;       // distance ratio, used as modifer for throttle
var distanceThreshold = 20; // We need to be within x cm of target to move on 
var current_wayPoint = -1;  // -1 because index is incremented immediately; 
var currentLocation = null;        // JSON - latitude and longitude {latitude: 124141, longitude:3515}
var previousLocation = null;    // JSON - latitude and longitude {latitude: 124141, longitude:3515}
// BOOLEAN LOGIC FOR FUNCTIONS
var turn_right = null;
var onTarget = false;
var wayPoints = [
    {latitude: 33.8817345, longitude: -117.88181787},
    {latitude: 33.88178246, longitude: -117.88185914},
    {latitude: 33.8817451429, longitude: -117.881912596}];
// Reach entry point 

var reachIP = '192.168.2.15';
var client = new net.Socket();
client.connect(9001, reachIP, function() {
	winston.info('Connected to reach');
});

client.on('data', function(data,err) { 
//	winston.info(String(data));
    if(err){
        winston.info("Error!: " + JSON.stringify(err));
    }
    // Parse the data into an array
    data = data.toString().split(" ").filter(theSpaces);
    currentLocation = {
            latitude: data[2],
            longitude: data[3]
        };
});

function theSpaces(value) {
  return value !== '';
}

// ** SYNCHRONOUS READ **  Reading waypoints from file 
/*
var filename = 'waypoints.json'; // Filename for gps waypoints
var wayPoints = JSON.parse(fs.readFileSync(filename, 'utf8'));
*/
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const atlas = new MyEmitter();

atlas.on('get_waypoint',function(){
  
    current_wayPoint++; 
     winston.info("getting next waypoint",wayPoints[current_wayPoint]);
    if(current_wayPoint >= wayPoints.length){
       stopRover();
       winston.info("reached end of waypoints");
    }
    else{
        onTarget = false;
        target_heading = geolib.getBearing(currentLocation,wayPoints[current_wayPoint]);
        atlas.emit('turn');
    }
});

atlas.on('turn',function(){
    let temp_throttle; 
    let leftThrottle;
    let rightThrottle; 
    winston.info('---- turning ----')
    calc_heading_delta();
    pathfinder();
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
        winston.info('turn_right:' + turn_right);

        // if we're within our error we drive
        if (Math.abs(heading_delta) <= turning_drive_error) {
            clearInterval(turn_timer);
            winston.info('----FOUND HEADING----');
            winston.info('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
            winston.info("Final heading before drive event: ", current_heading);
            winston.info("heading delta:" + heading_delta);
            stopRover();
            atlas.emit('drive');
        } 
        // we turn if we're not within our error or at distance
        else {
            // proportional error with respect to heading
            proportional_error = heading_delta / 180;
            temp_throttle = Math.round(throttle_max * proportional_error * distanceModifier)
            temp_throttle = (turning_drive_constant + temp_throttle).clamp(throttle_min,throttle_max);
            if(turn_right){
                    winston.info('Turning right');
                    leftThrottle = temp_throttle;
                    rightThrottle = temp_throttle * -1; // removed temp_throttle - 10
            }else{
                    winston.info('Turning left');
                    rightThrottle = temp_throttle;
                    leftThrottle = temp_throttle * -1;
            } 
            setMotors(leftThrottle, rightThrottle);
            winston.info("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
        }
        // sets the rover speed to the calculated value
    }, 50); // end of turn timer
}) // end of turn event 


atlas.on('drive',function(){
    winston.info('---- driving ----')
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
        
        if (distance < onTargetError) {
            clearInterval(drive_timer);
            stopRover(); 
            atlas.emit('get_waypoint');
        }
        else if (Math.abs(heading_delta > forward_drive_to_turn_error)) { //removed || distance < distance_threshold 
            clearInterval(drive_timer);
            stopRover(); 
            winston.info("Done driving forward");     
            atlas.emit('turn'); //distance < distance_threshold ? atlas.emit('get_waypoint') : atlas.emit('turn');    

        }
        // If heading is nominal, drive forward
        else if (Math.abs(heading_delta) <= forward_drive_error) {
            leftThrottle  = forward_drive_constant;
            rightThrottle = forward_drive_constant;
            winston.info('Moving forward at drive constant');
            setMotors(leftThrottle, rightThrottle);
            winston.info("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
        } 
        // Adjust left and right throttle to maintain nominal heading
        else {
            // proportional error with respect to heading
            proportional_error = heading_delta / 180;
            winston.info('!turn_right: ' + !turn_right);
            winston.info('turn_right:' + turn_right);
            throttle_offset = Math.round(forward_drive_constant * proportional_error * 1.5 * Math.log(heading_delta));
            if(turn_right){
                winston.info('Slowly turning right');
                leftThrottle = (forward_drive_constant + throttle_offset);
                rightThrottle = (forward_drive_constant - throttle_offset);
            }else{
                winston.info('Slowly turning left');
                leftThrottle = forward_drive_constant - throttle_offset;
                rightThrottle = forward_drive_constant + throttle_offset;
            }
            leftThrottle *= distanceModifier*leftThrottle;
            rightThrottle *= distanceModifier*rightThrottle;
            leftThrottle = leftThrottle.clamp(forward_throttle_min, forward_throttle_max);
            rightThrottle = rightThrottle.clamp(forward_throttle_min, forward_throttle_max);
            
        
            setMotors(leftThrottle, rightThrottle);
            winston.info("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);
        } 
    }, 50); // end of drive timer 
}) // end of drive event 

//----GRAB DATA FROM IMU----
var invalidHeadingCounter = 0;
python_proc.stdout.on('data', function (data){   
    data = parseFloat(data); 
    //winston.info(data);
    if (isNaN(data)) {
        winston.info("Current Heading is NaN");
        stopRover();
        clearInterval(turn_timer);
        clearInterval(drive_timer);
    } else if ( 0 <= data && data <= 360){
        imuHeading = data;
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
        winston.info("Rover stopped because of bad heading data");
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
    //leftSpeed = leftSpeed*-1;
    if (leftSpeed < -127 || leftSpeed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    winston.info('Y: ' + leftSpeed );
    // Since we are using unsigened ints for serial make it between 0 and 254
    leftSpeed = leftSpeed + 127;
    parseInt(leftSpeed);
    left_side_arr[1] = leftSpeed;
    //onsole.log(left_side_arr);
    //winston.info(left_side_buff);
    port.write(left_side_buff);
}

function setRightSide(rightSpeed) {
    //rightSpeed = rightSpeed * -1;
    if (rightSpeed < -127 || rightSpeed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    winston.info('x: ' + rightSpeed);
    // Since we are using unsigned ints for serial make it between 0 and 254
    rightSpeed = rightSpeed + 127;
    parseInt(rightSpeed);
    right_side_arr[1] = rightSpeed;
    //winston.info(right_side_arr);
    //winston.info(right_side_buff);
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
    winston.info('ArduinoMessage: ' + data);
    var jsonBuilder = {};
    jsonBuilder.ArduinoMessage = data;
    jsonBuilder.type = 'debug';
    //ssendHome(jsonBuilder);
});

port.on('open',function(){
    winston.info('open');
    //setTimeout(main,1000);
});

// KILL ALL PROCESS AND STOP ROVER MID SCRIPT
process.on('SIGTERM', function() {
    winston.info("STOPPING ROVER");
    clearInterval(turn_timer);
    clearInterval(drive_timer);
    stopRover();  
    setTimeout(function(){ //required to fully stop the rover
        port.close();
        process.exit();
    },1000);
});

process.on('SIGINT', function() {
    winston.info("\n####### JUSTIN LIKES MENS!! #######\n");
    winston.info("\t\t╭∩╮（︶︿︶）╭∩╮");
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

var main = setInterval(()=> {
    if(currentLocation !== null && current_heading !== null){
        clearInterval(main);
        setTimeout(() => atlas.emit('get_waypoint'), 3000);
    }
}, 100);
 // Timeout used for the serial port to open with the arduino

//Shan's Get heading calc based on logic Shan and Brandon came up with to determine which direction the rover will be turning
//IE: Is turning left or right the shorter turn?
function calc_heading_delta(){
    winston.info('Calculating Heading Delta & Direction');
    current_heading = imuHeading;
    let abs_delta = Math.abs(current_heading - target_heading);
    // xnor operation also note (!turn_right = turn_left)
    turn_right = current_heading > target_heading === abs_delta > 180; 
    heading_delta = abs_delta <= 180 ? abs_delta : 360 - abs_delta;
    previousLocation = currentLocation; 
}


//uses geolib to get distance and targetHeading. 
function pathfinder() {
    //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation) 
    distance = geolib.getDistance(currentLocation,wayPoints[current_wayPoint],1,5);
    distance = geolib.convertUnit('cm',distance);
    //This geolib function needs to be (myGPSlocation,current_waypointGPSlocation)
    target_heading = geolib.getBearing(currentLocation,wayPoints[current_wayPoint]);
    winston.info('***** new heading ****:', target_heading);
    output_nav_data();
    if (distance <= onTargetRange) {
        distanceModifier = distance / onTargetRange;
        winston.info("distanceModifier Modifier: " + distanceModifier);
    } else {
        distanceModifier = 1;
    }
}

function output_nav_data() {
    winston.info("Current Heading: " + current_heading);
    winston.info("Target Heading: " + target_heading);
    winston.info("Heading Delta: " + heading_delta);
    winston.info("Distance: ", distance);
    winston.info("Current Location: ", currentLocation);
    winston.info("Turning right: " + turn_right);
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
