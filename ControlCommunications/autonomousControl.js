var SerialPort = require('serialport');
//var port = new SerialPort('/dev/cu.usbmodem1412241');
var port = new SerialPort('TBD');



port.write(joystick_value,function(){
	actionSequence = null;
});

