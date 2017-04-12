var PythonShell = require('python-shell');
var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'],
        scriptPath: '/home/pi/TitanRover/mobility/autonomous/python3/',
        args: []
    };

module.exports = {
    drive_forward: function(){
        options.args[0] = 'f';
    
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });
    },
    stop: function(){
        options.args[0] = 's';
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        }); 
    },
    turn_left: function(){
        options.args[0] = 'l';
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });
    },
    turn_right: function(){
        options.args[0] = 'r';
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
        });
    },
    set_speed: function(right_speed, left_speed){
        
        options.args[0] = 'x';
        options.args[1] = right_speed;
        options.args[2] = left_speed;
        console.log('left speed: ' + options.args[1] +' right speed: ' + options.args[2]);   
        PythonShell.run('pyShell_handler.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
        });
    },
   
};
