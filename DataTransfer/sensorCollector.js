/*
  Author: Joseph Porter
  Titan Rover - Sensor Collector
  Description: 
    
    Will send the data from the sensors back to the homebase server.
    Will be reading from a file since most of the data will be coming from serial.

*/
var SerialPort = require('serialport');
 
var port = new SerialPort('/dev/tty-usbserial1', {
  parser: SerialPort.parsers.raw
});

port.on('data', function(data) {
    console.log('Data: ' + data);
})

