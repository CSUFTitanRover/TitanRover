var sys = require('sys');

//Testing arguments for python heading test
var arg1 = 33.8443;
var arg2 = -118.34342;

var spawn = require("child_process").spawn;
var process = spawn('python',["Adafruit_GPS_Heading.py",arg1, arg2]);

process.stdout.on('data', function (data){
	var valueReturn = data.toString();
	console.log(valueReturn);
	
});

