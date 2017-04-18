var sys = require('util');
var spawn = require("child_process").spawn;

//call child_process and pass values
var process = spawn('python', ["RuntMotor.py", 100, 100]);

//Remain code for Testing Code with text outputs
//var end = new Date() - start;

//for(var i=0;i<50;i++) {
//    var rightMotors, leftMotors;
//    rightMotors = i;
//    leftMotors = i * 2;
//    var process = spawn('python', ["RuntMotor.py", rightMotors, leftMotors]);

    //process.stdout.on('data', function (data) {
    //    var arr = data.toString();
    //    console.log(String(arr));
    //});
//};
//console.log("Execution time: ", end);
