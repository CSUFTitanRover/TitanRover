/*
  Author: Joseph Porter
  Titan Rover - Sensor Collector
  Description: 
    
    Will send the data from the sensors back to the homebase server.
    Will be reading from a file since most of the data will be coming from serial.

*/
var serialPort = require('serialport');
var request = require('request');
var fs = requre('fs');

// Will store our data when we loss connection to the homebase
var dissFile = fs.createWriteStream('disconnect.json', {flags: 'a'});

var isDisconnect = false;

// This is the serial port we are reading all of our data from
var port = new serialPort('/dev/ttyACM0', {
  parser: serialPort.parsers.readline('\r\n')
});


// Will send the data back to the homebase station to be saved into a database
function phoneHome(value) {
  request.post({
		url: 'http://192.168.1.122:6993/data',  // Replace this with IP of homebase server
		method: 'POST',
		json: true,
		body: value
	}, function(error, res, body) {
		if (error) {
			console.log(error);
            
            // We have lost connection save to a json file
            // Need to save as a json array not doing that now
            dissFile.write(JSON.stringify(value));
            isDisconnect = true;
		}
		else {
            
            // If this is the first time after losing connection we have connection send the entire file back to the homebase station
            // This needs to be fixed and sent as json
            if (isDisconnect) {
                fs.readFile('disconnect.json', function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        phoneHome(data);
                    }
                });
                
                // Close our writeStream
                dissFile.close();
                
                // Delete the file since we sent the data
                fs.unlinkSync('disconnect.json');
                
                // Recreate our writeStream to use for next time we disconnect
                dissFile = fs.createWriteStream('disconnect.json', {flags: 'a'});
                isDisconnect = false;
            }
			//console.log(res.statusCode);
		}
	});
}


// Will format the data to send to the homebase server
function formatter(value) {
  var jsonBuilder = {};
  var splitted = value.split(':');
  console.log(splitted);

  /* =================================
  == 00: Mobility
  == 01: 5TE: Format { id: , timestamp: , EC: , VWC: , TempCelsiusSoil: }
  == 02: DHT11: Format { id: , timestamp: , Humidity: , TempCelsiusOutside: }
  == 03: SonicRangeFinder Science: Format { id: , timestamp: , Distance(cm): }
  ====================================*/
  switch(splitted[0]) {
    case '00':
      jsonBuilder.id = "00";
      jsonBuilder.timestamp = Date.now();
      break;
    case '01':
      jsonBuilder.id = "01";
      jsonBuilder.timestamp = Date.now();
      jsonBuilder.EC = Number(splitted[1]);
      jsonBuilder.VWC = Number(splitted[2]);
      jsonBuilder.TempSoil = Number(splitted[3].substring(0, 4));
      break;
    case '02':
      jsonBuilder.id = "02";
      jsonBuilder.timestamp = Date.now();
      jsonBuilder.Humidity = Number(splitted[1]);
      jsonBuilder.TempOutside = Number(splitted[2].substring(0, 4));
      break;
    case '03':
      jsonBuilder.id = "03";
      jsonBuilder.timestamp = Date.now();
      jsonBuilder.Distance = Number(splitted[1]);
      break;
    default:
      jsonBuilder.id = null;
      console.log("Do not recognize that id!!!!\nIt has been removed!!!!");
  }

  if (jsonBuilder.id != null) {
	console.log(jsonBuilder);
	phoneHome(jsonBuilder);
  }
}

port.on('data', function(data) {
  formatter(data);


  // We have found the end of the serial data send to server
  /*if (data.slice(-1) == '/') {
    formatter(valueToSend);
    valueToSend = "";
  }
  else {  // Keep adding data to the valueToSend
    valueToSend += data;
  }*/
});


process.on('SIGINT', function() {
	console.log("\n############ Shutting Down ###########\n");
    dissFile.end();
    dissFile.close();
	process.exit();
});

