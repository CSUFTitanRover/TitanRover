geolib = require('geolib');






var lat_2 = 31.47581;
var lon_2 = -110.00268;

var lat_1 = 31.47581;
var lon_1= -110.00268;

// var current_lat = 0;
// var current_lon = 0;

// var current_lat = 0;
// var current_lon = 0;

// var dest_lat = 0;
// var dest_lon = 0;

var distance = geolib.getDistance(
    {latitude: lat_1, longitude: lon_1}, 
    {latitude: lat_2, longitude: lon_2} 
);
// Rhumb line bearing
var destination_bearing = geolib.getRhumbLineBearing(
    {latitude: lat_1, longitude: lon_1}, 
    {latitude: lat_2, longitude: lon_2} 
    );

// Great circle bearing
var gc_bearing = geolib.getBearing(
    {latitude: lat_1, longitude:lon_1}, 
    {latitude: lat_2, longitude: lon_2}
);

var current_speed = geolib.getSpeed(
    {lat: 51.567294, lng: 7.38896, time: 1360231200880},
    {lat: 52.54944, lng: 13.468509, time: 1360245600880},
    {unit: 'mph'}
);


console.log("Distance: "+distance);
console.log("rhumb: " + destination_bearing);
console.log("gc: " + gc_bearing);

// While 