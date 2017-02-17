geolib = require('geolib');

var now = require("performance-now")

// Get coordinate
var timestamp = now() ; 

// End get coordinate 


// Dummy data

lat_2 = 31.47581;
lon_2 = -110.0026892;

lat_1 = 31.47581;
lon_1=  -110.0026810;



var distance = geolib.getDistance(
    {latitude: lat_1, longitude: lon_1}, 
    {latitude: lat_2, longitude: lon_2},
    1, // Setting Accuracy to 1
    3  // Setting precision to centimeters 
);


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


var current_speed = geolib.getSpeed(
    {lat: 51.567294, lng: 7.38896, time: timestamp},
    {lat: 52.54944, lng: 13.468509, time: timestamp},
    {unit: 'kmh'}
);




console.log("Great circle bearing: " + gc_bearing);
console.log("Distance: " + distance);
console.log("Speed: " + current_speed);
console.log("timestamp: " + now);