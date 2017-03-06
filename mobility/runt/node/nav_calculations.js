geolib = require('geolib');
var jsonfile = require('jsonfile');
var now = require("performance-now")

// Get coordinate
//var timestamp_in_micro = now() ;  // Converting from microseconds to miliseconds. 
//var timestamp_in_milli = timestamp_in_micro / 1000;
// End get coordinate 


// Test data
lat_2 = 33.881743922;
lon_2 = -117.882490224;

lat_1 =  33.88174266;
lon_1=  -117.882489185;
var unit = 'ft';
var file = '/Users/insight/workspace/github/TitanRover/mobility/runt/node/gps.json';

setInterval(function(){
    jsonfile.readFile(file, function(err, obj) {
   var distance = geolib.getDistance(
    {latitude: 33.88374071, longitude: -117.884992}, 
    {latitude: obj.latitude, longitude: obj.longitude},
    1, // Setting Accuracy to 1
    8  // Setting precision to centimeters 
    );

   distance =  geolib.convertUnit(unit,distance);

    console.log(distance + unit);
});
},1000);


// Bearing is the direction from lat_1 -----> lat_2
var gc_bearing = geolib.getBearing(
    {latitude: lat_1, longitude:lon_1}, 
    {latitude: lat_2, longitude: lon_2}
);

// Optional Rhumbline bearing vs Great circle
var destination_bearing = geolib.getRhumbLineBearing(
    {latitude: lat_1, longitude: lon_1}, 
    {latitude: lat_2, longitude: lon_2} 
    );

/**
        * Calculates the speed between to points within a given time span.
        *
        * @param        object      coords with javascript timestamp {latitude: 51.5143, longitude: 7.4138, time: 1360231200880}
        * @param        object      coords with javascript timestamp {latitude: 51.5502, longitude: 7.4323, time: 1360245600460}
        * @param        object      options (currently "unit" is the only option. Default: km(h));
        * @return       float       speed in unit per hour
*/

// JS timestamp is in Miliseconds. Peformance-Now time is in microseconds. 
// var current_speed = geolib.getSpeed(
//     {latitude: lat_1, longitude: lon_1, time: timestamp_in_milli},
//     {latitude: lat_2, longitude: lon_2, time: timestamp_in_milli +1000 }
// );

//console.log("Great circle bearing: " + gc_bearing);
// console.log("Speed " + current_speed);
// console.log("timestamp in microseconds: " + timestamp_in_micro);
// console.log("timestamp in milliseconds " + timestamp_in_milli);