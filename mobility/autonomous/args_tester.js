var PythonShell = require('python-shell');
var sleep = require('sleep');

var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'],
        scriptPath: './python3/',
        args: []
    };

var drive_forward = function(){
        options.args[0] = 'f';
    
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });
    };

var stop = function(){
        options.args[0] = 's';
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        }); 
    };
var turn_left = function(){
        options.args[0] = 'l';
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });
    };
var turn_right = function(){
        options.args[0] = 'r';
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
        });
    };
var set_speed = function(right_speed, left_speed){
        
        options.args[0] = 'x';
        options.args[1] = right_speed;
        options.args[2] = left_speed;
        console.log('left speed: ' + options.args[1] +' right speed: ' + options.args[2]);   
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
        });
    };

var isTriggered = false;
var main = setInterval(function(){
    //call functions here to drive forward/leftright
    //turn_left();
    //set_speed(100,100);
    stop();
        //setTimeout(function(){;},1000); 
},2000);