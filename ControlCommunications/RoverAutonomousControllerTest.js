var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.readline('\n')
});


var x_Axis_arr = new Uint16Array(2);
x_Axis_arr[0] = 0x0008;
var x_Axis_buff = Buffer.from(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(2);
y_Axis_arr[0] = 0x0009;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);

var time = new Date();

function setYAxis(speed) {
    if (speed < -127 || speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('Y: ' + speed );
    // Since we are using unsigened ints for serial make it between 0 and 254
    y_Axis_arr[1] = speed + 127;
    port.write(y_Axis_buff);
}

function setXAxis(speed) {
    if (speed < -127 || speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('x: ' + speed);
    // Since we are using unsigned ints for serial make it between 0 and 254
    x_Axis_arr[1] = speed + 127;
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

var i = -127;
var main = setInterval(function(){
    if (i < 128) {
    setYAxis(i);
    setXAxis(i);
    } else {
        stopRover();
        clearInterval(main);
    }
        //setTimeout(function(){;},1000);
    i++;
},50);

process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    stopRover();
    port.close();
    process.exit();
});

process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    stopRover();
    port.close();
    // some other closing procedures go here
    process.exit();
});