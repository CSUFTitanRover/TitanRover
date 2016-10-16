/*
  Author: Joseph Porter
  Titan Rover - Example for sending to the homebase server 
  Description: 
    
    Just an example to send data to the homebase serverx
*/
var request = require('request');

// Need to find a way to get science sensors to send data back to rovers server
// Rovers server will then send the data back to the home station.

// Example data from sensor
var post_data = {
	id: 0,
	timestamp: Date.now(),
	sensordata: Math.random()
};



// Send the data to the home base server
request.post({
		url: 'http://localhost:3000/data',
		method: 'POST',
		json: true,
		body: post_data
	}, function(error, res, body) {
		if (error) {
			console.log(error);
		}
		else {
			console.log(res.statusCode);
		}
	});
