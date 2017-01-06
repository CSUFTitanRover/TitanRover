var sys = require('sys');

var start = new Date();

var spawn = require("child_process").spawn;
var process = spawn('python',["IMU_Acc_Mag_Gyro.py"]);

process.stdout.on('data', function (data){
	var valueReturn = data.toString();
	var arr = valueReturn.split(",").map(function (val) {
		return Number(val) + 1;
		});

	//document.write(JSON.stringify(arr));
	if(1)
		for(var i=0;i<arr.length;i++) {
    			console.log(arr[i] + ' ');
		}

	var end = new Date() - start;
	console.log("Execution time: ", end);
});

