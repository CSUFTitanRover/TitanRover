var sys = require('util');
var spawn = require("child_process").spawn;
var python_proc = spawn('python',["/home/pi/TitanRover/mobility/autonomous/python3/IMU_Acc_Mag_Gyro.py"]);

//Inject a current_heading, if not, leave undefined ex: var current_heading; You may also adjust target heading depending on when we have waypoints
var heading_delta = null;
var current_heading = null; //leave untouched, written from the IMU
var target_heading = 0; //change to desired target heading, will be replaced post calculation of GPS data
var turning_drive_error = 5; //DEGREES OF ERROR

//THROTTLE LOGIC
var throttle_min = 30; //Minimum throttle to turn the rover
var throttle_max = 127; //Maximum throttle value acceptable
var leftThrottle;
var rightThrottle;
var turn_timer; 
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
    current_heading = parseFloat(data);
    calc_heading_delta();
	//winston.info('Current heading: ' + data.toString());
    //calc_heading_delta();
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
    console.log('port is open');

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

var turningP = function() {
    console.log('----turningP----');
    turn_timer = setInterval(function() {
        if (Math.abs(heading_delta) <= turning_drive_error) {
            clearInterval(turn_timer);
            stopRover();
            console.log('----FOUND HEADING----');
            console.log('Current Heading: ' + current_heading + " Target Heading: " + target_heading);
            // Tell the UI we finished turning 
            io.emit('enable knob');
        } else {
            //Calculate the throttle percentage change based on what the proportion is.
            headingModifier = heading_delta / 180;
            let temp_throttle; 
            console.log('turn left: ' + !turn_right);
            console.log('turn right: ' + turn_right);
            temp_throttle = Math.round( (throttle_max * headingModifier) + throttle_min);
            temp_throttle = temp_throttle.clamp(throttle_min,throttle_max);
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
            setMotors(leftThrottle, rightThrottle);
            console.log("Setting rover speed - Left: " + leftThrottle + ", right:" + rightThrottle);

    },50);
};

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
