/*
  Author: Joseph Porter
  Titan Rover - Sensor Collector
  Description:

    Will send the data from the sensors back to the homebase server.
    Will be reading from a file since most of the data will be coming from serial.

*/
var serialPort = require('serialport');
var request = require('request');

// Will store our data until it reconnects
var disConnectedData = [];

// Determines if the rover is connected or not
var connected = true;

// This is the serial port we are reading all of our data from
var port = new serialPort('/dev/ttyACM0', {
    parser: serialPort.parsers.readline('\r\n')
});


// Will send the data back to the homebase station to be saved into a database
function phoneHome(value, multi) {

    var URL = 'http://192.168.1.122:6993';

    if (multi) {
        URL += '/dataMult';
    } else {
        URL += '/data';
    }
    request.post({
        url: URL, // Replace this with IP of homebase server
        method: 'POST',
        json: true,
        body: value
    }, function(error, res, body) {
        if (error) {
            //console.log(error);
            disConnectedData.push(value);

            if (connected) {
                console.log("###### We have lost connection!! ######\n======== Saving data now!!! ========");
            }
            connected = false;
        } else if (connected == false) {
            console.log("++++++ We have aquired a connection!! ++++++\n====== Transmitting saved data!!! ======");
            connected = true;
            phoneHome(disConnectedData, true);
            disConnectedData = [];
        }
        //console.log(disConnectedData);
    });
}



// Will format the data to send to the homebase server
function formatter(value) {
    var jsonBuilder = {};
    var splitted = value.split(':');

    //console.log(splitted);

    /* =================================
    == 00: Mobility
    == 01: 5TE: Format { id: , timestamp: , EC: , VWC: , TempCelsiusSoil: }
    == 02: DHT11: Format { id: , timestamp: , Humidity: , TempCelsiusOutside: }
    == 03: SonicRangeFinder Science: Format { id: , timestamp: , Distance(cm): }
    ====================================*/
    switch (splitted[0]) {
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
            console.log("###### ID NOT RECOGNIZED IGNORING IT ######");
    }

    if (jsonBuilder.id != null) {
        //console.log(jsonBuilder);
        phoneHome(jsonBuilder, false);
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
