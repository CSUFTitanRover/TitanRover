var PythonShell = require('python-shell');

module.exports = {
    move_forward: function(throttle){
        var options = {
	  mode: 'text',
	  pythonPath: '/usr/bin/python',
	  pythonOptions: ['-u'],
	  scriptPath: './python3',
  	  args: ['f',throttle]
	};

	PythonShell.run('pyShell_handler', options, function (err, results) {
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution
	  console.log('results: %j', results);
	});
    },
    stop: function(){
      var options = {
	  mode: 'text',
	  pythonPath: '/usr/bin/python',
	  pythonOptions: ['-u'],
	  scriptPath: './python3',
  	  args: ['s']
	};

	PythonShell.run('pyShell_handler', options, function (err, results) {
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution
	  console.log('results: %j', results);
	});
    },
    turn_right: function(throttle){
        var options = {
	  mode: 'text',
	  pythonPath: '/usr/bin/python',
	  pythonOptions: ['-u'],
	  scriptPath: './python3',
  	  args: ['r',throttle]
	};

	PythonShell.run('pyShell_handler.py', options, function (err, results) {
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution
	  console.log('results: %j', results);
	});
    },
    turn_left: function(throttle){
        var options = {
	  mode: 'text',
	  pythonPath: '/usr/bin/python',
	  pythonOptions: ['-u'],
	  scriptPath: './python3',
  	  args: ['l',throttle]
	};

	PythonShell.run('pyShell_handler', options, function (err, results) {
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution
	  console.log('results: %j', results);
	});
    },
   
};
