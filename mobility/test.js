var sys = require('util');

var start = new Date();

var spawn = require("child_process").spawn;
var process = spawn('python',["IMU_Acc_Mag_Gyro.py"]);

process.stdout.on('data', function (data){
	console.log(data.toString());
	
	////////////////////////////////////////////////////////////
});

