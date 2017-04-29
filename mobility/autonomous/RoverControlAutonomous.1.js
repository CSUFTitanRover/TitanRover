var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var serialPort = require('serialport');
var sleep = require('sleep');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.readline('\n')
});


var x_Axis_arr = new Uint16Array(3);
x_Axis_arr[0] = 0xB;
x_Axis_arr[2] = 0xbbaa;
var x_Axis_buff = Buffer.from(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(3);
y_Axis_arr[0] = 0xC;
y_Axis_arr[2] = 0xbbaa;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);

var time = new Date();
var timer;
function setRightSide(leftSpeed) {
    if (leftSpeed < -127 || leftSpeed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('Y: ' + leftSpeed );
    // Since we are using unsigened ints for serial make it between 0 and 254
    leftSpeed = leftSpeed + 127;
    parseInt(leftSpeed);
    y_Axis_arr[1] = leftSpeed;
    //x_Axis_arr[1] = parseInt(speed + 127);

    //console.log(y_Axis_buff);
    console.log(y_Axis_arr);
    console.log(y_Axis_buff);
    port.write(y_Axis_buff);
    //port.write(x_Axis_buff)
}

function setLeftSide(rightSpeed) {
    if (rightSpeed < -127 || rightSpeed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('x: ' + rightSpeed);
    // Since we are using unsigned ints for serial make it between 0 and 254
    rightSpeed = rightSpeed + 127;
    parseInt(rightSpeed);
    x_Axis_arr[1] = rightSpeed;
    console.log(x_Axis_arr);
    console.log(x_Axis_buff);
    port.write(x_Axis_buff);
}

function stopRover() {
    //receiveMobility(zeroMessage[0]);
    //receiveMobility(zeroMessage[1]);
    x_Axis_arr[1] = 127;
    y_Axis_arr[1] = 127;
    port.write(x_Axis_buff);
    port.write(y_Axis_buff);
    // Stopping all joints

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
var i = 0;
setTimeout(main,3000);

function main()
{
    setInterval(function()
    {
        if(i < 128){   
            i++;
            setRightSide(i);
            setLeftSide(0);
        } else {
            stopRover();
            clearInterval(timer);
            //process.exit();
        }
            //setTimeout(function(){;},1000);
        i++;

},50)};


process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    clearInterval(timer);
    stopRover();
   
    

});

process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    clearInterval(timer);
    stopRover();

    //port.close();
    process.exit(port.close());
    // some other closing procedures go here

});