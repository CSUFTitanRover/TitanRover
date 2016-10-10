var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var app = express()
var mongo = require('mongodb').MongoClient;

// Will be set when we connect to the MongoDB
var database;


// Start the server
var server = app.listen(3000, function() {
	console.log("============ Server is up and running on port: ", server.address().port, "=============");
});


// Connect to the mongodb I changed it to port 6969 cause im dirty and the
// default port of 27017 was not working for me for some reason
mongo.connect("mongodb://localhost:6969/test", function(err, db) {
	if (!err) {
		console.log("=========== Connected to MongoDB =============");
		database = db
	}
	else {
		console.log("########## Failed to Connect to Database ##########");
		throw new Error("Terminating the server database not started");
	}

});

// parse application/json
app.use(bodyParser.json())


app.use('/data', function(req, res, next) {
    console.log("======= Storing Data ========");
    next();
})

app.post('/data', function(req, res, next) {
    console.log(req.body);
    var request = req.body;

    // The id will be what kind of data this is
    // saving it into a json file for now 
    // Should probably use either mysql or mongodb to store the data for quick access
    switch(request.id)
    {
        case 0:
			// Store in the database
            database.collection('data').insertOne(request);
            console.log("Storing mobility data");
            break;
        case 1:
			// Store in the database
            database.collection('data').insertOne(request);
            console.log("Storing sensor data");
            break;
        // Make more for the sensors

		default:
			// The ID does not match or is not included
			res.sendStatus(400);
    }


    res.sendStatus(200);
});

// Shutdown the server and close the database on ctrl+c press
// This shutdowns the connections gracfully
process.on( 'SIGINT', function() {
	console.log("\n####### Server shutting down #######\n");
	database.close();
  // some other closing procedures go here
	process.exit( );
});
