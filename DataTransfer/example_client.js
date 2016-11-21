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

// Example data from multiple sensors.
var multi_data = [
	{ id: 0, timestamp: Date.now(), Temperature: Math.random()},
	{ id: 1, timestamp: Date.now(), WaterDepth: Math.random()},
	{ id: 0, timestamp: Date.now(), Temperature: Math.random()},
	{ id: 1, timestamp: Date.now(), WaterDepth: Math.random()},
	{ id: 0, timestamp: Date.now(), Temperature: Math.random()},
	{ id: 1, timestamp: Date.now(), WaterDepth: Math.random()},
	{ id: 0, timestamp: Date.now(), Temperature: Math.random()},
	{ id: 1, timestamp: Date.now(), WaterDepth: Math.random()}
]



// Send the data to the home base server single value
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

// Send the data to the home base server using multiple values
request.post({
	url: 'http://localhost:3000/dataMulti',
	method: 'POST',
	json: true,
	body: multi_data
}, function(error, res, body) {
	if (error) {
		console.log(error);
	}
	else {
		console.log(res.statusCode);
	}
});

// Example way to get all the values with a specific ID
request.get({
	url: 'http://localhost:3000/getdata/0',
	method: 'GET',
	json: true
}, function(error, res) {
	if (error) {
		console.log(error);
	}
	else {
		console.log(res.statusCode);
	}

	// The returned data will be in the body of res
	console.log(res.body);
});
