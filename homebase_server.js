var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var app = express()

// parse application/json
app.use(bodyParser.json())

console.log("Creating the server");

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
            fs.appendFile('mobility.json', JSON.stringify(request) + '\n');
            console.log("Storing mobility data");
            break;
        case 1:
            fs.appendFile('sensor.json', JSON.stringify(request) + '\n');
            console.log("Storing sensor data");
            break;
        // Make more for the sensors
    }


    res.sendStatus(200);
});

app.listen(3000);