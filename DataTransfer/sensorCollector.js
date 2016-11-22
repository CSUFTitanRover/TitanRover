/*
  Author: Joseph Porter
  Titan Rover - Sensor Collector
  Description: 
    
    Will send the data from the sensors back to the homebase server.
    Will be reading from a file since most of the data will be coming from serial.

*/
var serialPort = require('serialport');
var request = require('request');

var port = new SerialPort('/dev/ttyACM0', {
  parser: SerialPort.parser.readline('/')
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
  var jsonBuilder;
  var splitted = value.split(':');

  /* =================================
  == 00: Mobility
  == 01: 5TE
  == 02: somethingelse
  ====================================*/
  switch(slitted[0]) {
    case '00':
      jsonBuilder.id = "00";
      jsonBuilder.timestamp = Date.now();
      break;
    case '01':
      jsonBuilder.id = "01";
      jsonBuilder.timestamp = Date.now();
      break;
    case '02':
      jsonBuilder.id = "02";
      jsonBuilder.timestamp = Date.now();
      break;
    default:
      console.log("Do not recognize that id!!!!\nIt has been removed!!!!");
  }

  phoneHome(jsonBuilder);
}

var valueToSend = "";
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

