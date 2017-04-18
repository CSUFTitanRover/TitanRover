var PythonShell = require('python-shell');
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

drive_forward();