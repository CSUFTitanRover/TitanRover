var sys = require('util');
var spawn = require("child_process").spawn;

//call child_process and pass values
var throttle = 0;
// var timer = setInterval(function(){
    
// },50);
var proc = spawn('python', ["RuntMotor.py",'x']);
proc.stdin.write('F');
// while(true){
//     console.log('throttle val: ' + throttle);
//     if(throttle >= 255){
//          var proc = spawn('python', ["RuntSpeed.py", 0, 0]);
//          proc.kill();
//          break;
//     }
//     var proc = spawn('python', ["RuntSpeed.py", throttle, throttle]);
//     throttle++;
// }











// Cleanup procedures 
process.on('SIGINT',function(){
    var proc = spawn('python', ["RuntMotor.py", 0, 0]);
    winston.info('shutting rover down.')
    process.exit();
});

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
