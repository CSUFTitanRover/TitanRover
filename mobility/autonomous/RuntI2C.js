
////////////////  I2C  Version   /////////////////
// Allows us to contorl the rpio pins on the raspberry pi
var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.raw
});

var sleep = require('sleep');
var i2c = require('i2c');

var device1 = new i2c(0x18, {
	device: '/dev/i2c-1', 
	debug: false
});

device1.setAddress(0x4);

// Motor 1 
var left = new Uint16Array(3);
left[0] = 0x000A;
left[2] = 0xbbaa;
var left = Buffer.from(left.buffer);

// Motor 2 
var right = new Uint16Array(3);
right[0] = 0x000C;
right[2] = 0xbbaa;
var right = Buffer.from(right.buffer);



function setYAxis(y_speed) {
    if (y_speed < -127 || y_speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('Y: ' + y_speed );
    // Since we are using unsigened ints for serial make it between 0 and 254
    y_speed = y_speed + 127;
    parseInt(y_speed);
    right[1] = y_speed;
    //left[1] = parseInt(speed + 127);

    //console.log(right);
    console.log(right);
    //device1.write(right, function(){});
    device1.write(right, function(){});
}

function setXAxis(x_speed) {
    if (x_speed < -127 || x_speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    console.log('x: ' + x_speed);
    // Since we are using unsigned ints for serial make it between 0 and 254
    x_speed = x_speed + 127;
    parseInt(x_speed);
    left[1] = x_speed;

    console.log(left);
    //device1.write(left, function(){});
    device1.write(left, function(){});
}



port.on('data', function(data) {
    console.log('ArduinoMessage: ' + data);

});

function stopRover() {
    //receiveMobility(zeroMessage[0]);
    //receiveMobility(zeroMessage[1]);
    left[1] = 127;
    right[1] = 127;
    //device1.write(left, function(){});
    //device1.write(right, function(){});
    device1.write(left, function(){});
    device1.write(right, function(){});
    // Stopping all joints

}


var i = 127;
setYAxis(120);
var main = setInterval(function(){
    if (i >= 0) {
        
        setXAxis(i);
        
    }else {
        stopRover();
        clearInterval(main);
	    process.exit();
    }
    i--;
},50);



//setInterval(()=>{},1000);
process.on('SIGTERM', function() {
    console.log("STOPPING ROVER");
    stopRover();
    process.exit();
});

// On SIGINT shutdown the server
process.on('SIGINT', function() {
    console.log("\n####### JUSTIN LIKES MENS!! #######\n");
    console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
    stopRover();
    // some other closing procedures go here
    process.exit();
});
