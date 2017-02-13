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
var bodyParser = require('body-parser');
var app = express();
var mongo = require('mongodb').MongoClient;
var socket = require('http').Server(app);
var io = require('socket.io')(socket);

// Will be set when we connect to the MongoDB
var database;

// Log all the storing and data retrieval into a log file
var logger = fs.createWriteStream('serverLog.txt', {
    flags: 'a'
});


// Start the server
socket.listen(6993, function() {
    console.log("============ Server is up and running on port: ", socket.address().port, "=============");
    logger.write(Date.now() + ": Started server\n");
});


// Connect to the mongodb I changed it to port 6969 cause im dirty and the
// default port of 27017 was not working for me for some reason
mongo.connect("mongodb://localhost:6969/test", function(err, db) {
    if (!err) {
        console.log("=========== Connected to MongoDB =============");
        logger.write(Date.now() + ": Connected to MongoDB\n");
        database = db
    } else {
        console.log("########## Failed to Connect to Database ##########");
        logger.write(Date.now() + ": Failed to connect to Database Error: " + err + '\n');
        throw new Error("\n\n\tTerminating the server database not started\n\n\n");
    }

});

var clients = [];

function sendSocketIO(value, dataType) {
    clients.forEach(function(socketClient) {
        if (socketClient.datatype == dataType) {
            io.to(socketClient.id).emit('update: chart data', value);
        }
    });
};


console.log("============= Socket.io is running ============");
logger.write(Date.now() + ": Socket.io running\n");
// Socket.io is going to be handling all the emits events that the UI needs.
io.on('connection', function(socketClient) {
    console.log("Client Connected: " + socketClient.id);
    logger.write(Date.now() + "===== Client Connected: " + socketClient.id + " ======\n");
    clients.push(socketClient);

    // immediately request Client ID from the newly connected socket
    socketClient.emit('get: client id');

    // Client Disconnected from the server
    socketClient.on('disconnect', function() {
        console.log("Client Disconnected: " + socketClient.id);
        var index = clients.indexOf(socketClient);
        if (index != -1) {
            clients.splice(index, 1);
        }
        /*
        var id = socketClient.id;
        delete clients.id;
        logger.write(Date.now() + ": ==== Client disconnected: " + socketClient.id + " ====\n");
        */
    });

    // request from client
    socketClient.on('set: client id', function(clientID) {
        socketClient.datatype = clientID;
    });

    // ********* THIS IS THE FIRST WAY I CAN THINK OF FOR QUERYING DATA
    /*
    	data from Client looks like this:
    	 data = {
    		 'sensorIds': this.state.sensorIds, // type Array[]
    		 'queryByTimeRange': this.state.queryByTimeRange, //bool
    		 'queryStartTime': queryStartTime, // int
    		 'queryEndTime': queryEndTime // int
    	 };
     */
    // request from client for Query Data
    socketClient.on('get: all data with timestamp range', function(data) {
        console.info('-----\nget: all data with timestamp range, CALLED');
        console.info('SensorIds: ' + data['sensorIds'] + '\nqueryByTimeRange: ' + data['queryByTimeRange'] + '\nqueryStartTime: ' + data['queryStartTime'] + '\nqueryEndTime: ' + data['queryEndTime']);

        // send a response back to the client
        // here we would query the data we need and set it to dataToSendBack
        var dataToSendBack;

        database.collection('data').find({
            id: data['sensorIds'],
            timestamp: {
                $gt: data['queryStartTime'],
                $lt: data['queryEndTime']
            }
        }).toArray(function(err, result) {
            if (err) {
                console.log(err);
                logger.write(Date.now() + ": Error finding data: " + err + '\n');
            } else if (result.length) {
                console.log("====== Sending back results from timestamp =========");
                logger.write(Date.now() + ": Found results with id: " + data['sensorIds'] + " with start and end time\n");
                dataToSendBack = result;
            } else {
                dataToSendBack = {
                    "message": "Invalid ID or incorrect format"
                };
            }
        });
        socketClient.emit('set: all data by id', JSON.stringify(dataToSendBack));

    });

    // request from client for Query Data
    socketClient.on('get: all data by id', function(data) {
        console.info('-----\nget: all data by id, CALLED');
        console.info('SensorIds: ' + data['sensorIds'] + '\nqueryByTimeRange: ' + data['queryByTimeRange'] + '\nqueryStartTime: ' + data['queryStartTime'] + '\nqueryEndTime: ' + data['queryEndTime']);

        // send a response back to the client
        // here we would query the data we need and set it to dataToSendBack

        var dataToSendBack; // just a str msg for now

        database.collection('data').find({
            id: data['sensorIds']
        }).toArray(function(err, result) {
            if (err) {
                console.log(err);
                logger.write(Date.now() + ": Error finding data: " + err + '\n');
            } else if (result.length) {
                console.log("====== Sending back results from timestamp =========");
                logger.write(Date.now() + ": Found results with id: " + data['sensorIds'] + " with start and end time\n");
                dataToSendBack = result;
            } else {
                dataToSendBack = {
                    "message": "Invalid ID or incorrect format"
                };
            }
        });
        socketClient.emit('set: all data by id', JSON.stringify(dataToSendBack));
    });


    // ******************************************************
    // New Query Data functions written by Michael - Untested

    socketClient.on('get: queryByTimerange', function(data) {
        console.info('-----\nget: queryByTimerange CALLED');
        console.info('SensorID: ' + data['sensorIds'] + '\nqueryByTimeRange: ' + data['queryByTimeRange'] + '\nqueryStartTime: ' + data['queryStartTime'] + '\nqueryEndTime: ' + data['queryEndTime']);

        // send a response back to the client
        // here we would query the data we need and set it to dataToSendBack
        var dataToSendBack;

        database.collection('data').find({
            id: data['sensorID'],
            timestamp: {
                $gt: data['queryStartTime'],
                $lt: data['queryEndTime']
            }
        }).toArray(function(err, result) {
            if (err) {
                console.log(err);
                logger.write(Date.now() + ": Error finding data: " + err + '\n');
            } else if (result.length) {
                console.log("========= Sending back results from timestamp =========");
                logger.write(Date.now() + ": Found results with id: " + data['sensorID'] + " by queryByTimerange\n");
                dataToSendBack = result;
            } else {
                dataToSendBack = {
                    "errorMessage": "Invalid ID or incorrect format"
                };
            }
        });
        socketClient.emit('set: queryByTimerange', dataToSendBack);
    });

    socketClient.on('get: queryAllData', function(data) {
        console.info('-----\nget: all data by id, CALLED');
        console.info('SensorIds: ' + data['sensorIds'] + '\nqueryByTimeRange: ' + data['queryByTimeRange'] + '\nqueryStartTime: ' + data['queryStartTime'] + '\nqueryEndTime: ' + data['queryEndTime']);

        // send a response back to the client
        // here we would query the data we need and set it to dataToSendBack

        var dataToSendBack; // just a str msg for now

        database.collection('data').find({
            id: data['sensorID']
        }).toArray(function(err, result) {
            if (err) {
                console.log(err);
                logger.write(Date.now() + ": Error finding data: " + err + '\n');
            } else if (result.length) {
                console.log("========= Sending back results from timestamp =========");
                logger.write(Date.now() + ": Found results with id: " + data['sensorID'] + " by queryAllData\n");
                dataToSendBack = result;
            } else {
                dataToSendBack = {
                    "errorMessage": "Invalid ID or incorrect format"
                };
            }
        });
        socketClient.emit('set: queryAllData', dataToSendBack);
    });


});


// parse application/json
app.use(bodyParser.json());


app.param(['id_val', 'startTime', 'endTime'], function(req, res, next, id_val, startTime, endTime) {
    logger.write(Date.now() + ": +++++++ Getting Data ID: " + id_val + " +++++++\n");
    next();
});


// Will return all the data points with a specific id
// Example use: http://localhost:3000/getdata/3
app.get('/getdata/:id_val', function(req, res) {
    database.collection('data').find({
        id: req.params.id_val
    }).toArray(function(err, result) {
        if (err) {
            console.log(err);
            logger.write(Date.now() + ": Error finding data: " + err + '\n');
        } else if (result.length) {
            console.log("========== Sending back data from id only field ==========");
            logger.write(Date.now() + ": Found results with id: " + req.params.id_val + '\n');
            res.json(result);
        } else {
            res.json({
                "message": "no data or invalid id"
            });
        }
    });
});


// Will return all data points within a specific time range
// The time range has to be in epoch time.
app.get('/getdata/:id_val/:startTime/:endTime', function(req, res) {
    database.collection('data').find({
        id: req.params.id_val,
        timestamp: {
            $gt: parseInt(req.params.startTime),
            $lt: parseInt(req.params.endTime)
        }
    }).toArray(function(err, result) {
        if (err) {
            console.log(err);
            logger.write(Date.now() + ": Error finding data: " + err + '\n');
        } else if (result.length) {
            console.log("====== Sending back results from timestamp =========");
            logger.write(Date.now() + ": Found results with id: " + req.params.id_val + " with start and end time\n");
            res.json(result);
        } else {
            res.json({
                "message": "Invalid ID or incorrect format"
            });
        }
    });
});



// Store the incoming data into a mongo db
app.use('/data', function(req, res, next) {
    logger.write(Date.now() + ": ======= Storing Data ID: " + req.body.id + " ========\n");
    next();
});

// Store a single value at a time.
// Needs to be incorrect format for it to work
app.post('/data', function(req, res, next) {
    var request = req.body;

    // Will return OK if everything is fine
    var statusCode = 200;

    if (request.id != undefined) {
        sendSocketIO(request, request.id);

        // Store the data within the MongoDB
        database.collection('data').insertOne(request);
    } else {
        statusCode = 400;
        console.log("####### INVALID REQUEST FORMAT ########");
    }

    res.sendStatus(statusCode);
});

app.use('/dataMulti', function(req, res, next) {
    logger.write(Date.now() + ": ======= Storing Multiple values =========\n");
    next();
});

// Send Multi data at the same time.  This is used incase the rover sends multi data after a signal loss
// Every line needs a id and timestamp
app.post('/dataMulti', function(req, res, next) {
    var request = req.body;

    var code = 200;

    database.collection('data').insert(request, function(err) {
        if (err) {
            code = 400;
            logger.write(Date.now() + ": ===== Something went wrong with storing Multiple values =====\n");
        }
    });
    res.sendStatus(200);
});


// Shutdown the server and close the database on ctrl+c press
// This shutdowns the connections gracfully
process.on('SIGINT', function() {
    console.log("\n####### Server shutting down #######\n");
    logger.write(Date.now() + ": Server shutting down\n");
    database.close();
    logger.end();
    logger.close();
    // some other closing procedures go here
    process.exit();
});
