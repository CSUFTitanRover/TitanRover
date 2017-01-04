/*
  Author: Joseph Porter
  Titan Rover - Rover Control
  Description: 
		Will be accepting commands from the homebase Controller and relaying
			these commands to its various sub processes

		Example: 
			Moblility code will be sent from the homebase controller to here and this will run the input
				or pass it to another process to run it.

		It will be sent as JSON with the format
		{ commandType: string, ...}
		each packet will consist of a commandType such as mobility, science, arm and use this to determine
		the subprocess it should relay it to followed by the data that needs to be sent
*/
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);

var PORT = 3000;

// Start the server
server.listen(PORT, function() {
	console.log("============ Server is up and running on port: ", server.address().port, "=============");
});

// parse application/json
app.use(bodyParser.json());

// Accept the command
app.use('/command', function(req, res, next) {
	next();
});


// Will accept the command and relay to process
app.post('/command', function(req, res, next) {
	var request = req.body;

	// Will return OK if everything is fine
	var statusCode = 200;

	// Find out what this command should do
	switch(request.commandType) {
			
			case 'mobility':
				// Either fork another process or just run code here
				break;
			case 'arm':
				// Do arm stuff
				break;
			default:
				// We did not recognize that commmand send error code
				console.log("###### Could not find commandType ######");
				statusCode = 404;
	}

	res.sendStatus(statusCode);
});

// On SIGINT shutdown the server
process.on('SIGINT', function() {
	console.log("\n####### Should not have pressed that!! #######\n");
	console.log("###### Deleting all files now!!! ######\n");
	console.log("\t\t╭∩╮（︶︿︶）╭∩╮");
	// some other closing procedures go here
	process.exit( );
});
