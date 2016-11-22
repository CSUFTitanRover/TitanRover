/*
  Author: Joseph Porter
  Titan Rover - Sensor Collector
  Description: 
    
    Will send the data from the sensors back to the homebase server.
    Will be reading from a file since most of the data will be coming from serial.

*/
var serialPort = require('serialport');
var request = require('request');

var port = new serialPort('/dev/ttyACM0', {
  parser: serialPort.parsers.readline('\r\n')
});


function phoneHome(value) {
  request.post({
		url: 'http://localhost:3000/data',  // Replace this with IP of homebase server
		method: 'POST',
		json: true,
		body: value
	}, function(error, res, body) {
		if (error) {
			console.log(error);
		}
		else {
			console.log(res.statusCode);
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
  == 01: 5TE
  == 02: somethingelse
  ====================================*/
  switch(splitted[0]) {
    case '00':
      jsonBuilder.id = "00";
      jsonBuilder.timestamp = Date.now();
      break;
    case '01':
      jsonBuilder.id = "01";
      jsonBuilder.timestamp = Date.now();
      jsonBuilder.value1 = Number(splitted[1]);
      jsonBuilder.value2 = Number(splitted[2]);
      jsonBuilder.value3 = Number(splitted[3].substring(0, 4));
      break;
    case '02':
      jsonBuilder.id = "02";
      jsonBuilder.timestamp = Date.now();
      jsonBuilder.value1 = Number(splitted[1]);
      jsonBuilder.value2 = Number(splitted[2].substring(0, 4));
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
	process.exit();
});

