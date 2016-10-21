/*
  Author: Joseph Porter
  Titan Rover - Server for the Homebase station 
  Description: 
    
    Will accept any data sent from the rover subsystems
    and save it into a MongoDB

	Must be in this format:
	
	{ "id" : value, "timestamp" : Date.now(), "sensorData1" : value ........ }
    
    Use the API endpoint to query data
	To get all the data by id use this URL

	http://localhost:3000/getdata/:id		id must be a value
	Will return the values as JSON
*/
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var app = express()
var mongo = require('mongodb').MongoClient;

// Will be set when we connect to the MongoDB
var database;

// Log all the storing and data retrieval into a log file
var logger = fs.createWriteStream('serverLog.txt', {flags: 'a'});


// Start the server
var server = app.listen(3000, function() {
	console.log("============ Server is up and running on port: ", server.address().port, "=============");
	logger.write(Date.now() + ": Started server\n");
});


// Connect to the mongodb I changed it to port 6969 cause im dirty and the
// default port of 27017 was not working for me for some reason
mongo.connect("mongodb://localhost:6969/test", function(err, db) {
	if (!err) {
		console.log("=========== Connected to MongoDB =============");
		logger.write(Date.now() + ": Connected to MongoDB\n");
		database = db
	}
	else {
		console.log("########## Failed to Connect to Database ##########");
		logger.write(Date.now() + ": Failed to connect to Database Error: " + err + '\n');
		throw new Error("\n\n\tTerminating the server database not started\n\n\n");
	}

});


// parse application/json
app.use(bodyParser.json())


app.param(['id_val', 'startTime', 'endTime'] function(req, res, next, id_val, startTime, endTime) {
	logger.write(Date.now() + ": +++++++ Getting Data ID: " + id_val + " +++++++\n");	
	next();
});


app.get('/getdata/:id_val', function(req, res) {
	database.collection('data').find({ id: parseInt(req.params.id_val) }).toArray(function(err, result) {
		if (err) {
			console.log(err);
			logger.write(Date.now() + ": Error finding data: " + err + '\n');
			res.sendStatus(400);
		} 
		else if (result.length) {
			logger.write(Date.now() + ": Found results with id: " + req.params.id_val + '\n');
			res.json(result);
		}
		else {
			res.json({ "message" : "no data or invalid id" });
		}
	});	
});

app.get('/getdata/:id_val/:startTime/:endTime', function(req, res) {
    database.collection('data').find({ id: parseInt(req.params.id_val), timestamp : { $gt parseInt(req.params.startTime), $lt: parseInt(req.params.endTime)}}).toArray(function(err, result) {
      if (err) {
          console.log(err);
          logger.write(Date.now() + ": Error finding data: " + err + '\n');
          res.sendStatus(400);
        }
        else if (result.length) {
            logger.write(Date.now() + ": Found results with id: " + req.params.id_val + " with start and end time\n");
            res.json(result);
        }
        else {
            res.json({"message" : "Invalid ID or incorrect format");
        }
    });
});



// Store the incoming data into a mongo db
app.use('/data', function(req, res, next) {
	logger.write(Date.now() + ": ======= Storing Data ID: " + req.body.id + " ========\n");
	next();
})


app.post('/data', function(req, res, next) {
	var request = req.body;

	// Will return OK if everything is fine
	var statusCode = 200;

	if (request.id != undefined) {

		// Store the data within the MongoDB

		database.collection('data').insertOne(request);
	}
	else {
		statusCode = 400;
		console.log("####### INVALID REQUEST FORMAT ########");
	}

	res.sendStatus(statusCode);
});


// Shutdown the server and close the database on ctrl+c press
// This shutdowns the connections gracfully
process.on( 'SIGINT', function() {
	console.log("\n####### Server shutting down #######\n");
	logger.write(Date.now() + ": Server shutting down\n");
	database.close();
	logger.end();
	logger.close();
	// some other closing procedures go here
	process.exit( );
});
