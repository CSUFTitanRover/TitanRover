/*
Author: Timothy Parks
This example serves to show how the geolib library will be used with waypoints
*/

'use strict';
var geolib = require('geolib');
var wayPoints = [
    //These waypoints, distance calculations and degree headings are verfied with online source
    {lat: 34.052222,   lon: -118.243611},//Los Angeles, CA (34.052222, -118.243611) start position
    {lat: 36.116800,   lon: -115.173798},//las vegas dist = 36167300 cm. @49.42Degrees
    {lat: 32.783056,   lon: - 96.806667}, //dallas, tx dist = 172504700 cm @97.0808Degress
    {lat: 39.778889,   lon: -104.982500},//Denver, CO (39.778889, -104.9825) is 106775300 cm. 319.0676Degrees
    {lat: 34.052222,   lon: -118.243611},//Los Angeles, CA (34.052222, -118.243611) is 133974200 cm 245.74Degrees
    {lat: 40.715517,   lon: - 73.999100}];//New York City, NY (40.715517, -73.9991) is 394497600 cm 65.91361Degrees

var current_wayPoint = 0;

while(current_wayPoint < wayPoints.length - 1){
    //if(no_list)
      //  load list
    var finalpoint = false;
    var distance = 0;
    var currentHeading = 0;

    if(true){//!finalpoint){
        //get IMU heading
        //current_wayPoint = Reach network connection
        console.log("Start Position = " + wayPoints[current_wayPoint].lat + ' ' + wayPoints[current_wayPoint].lon);
        console.log("Ending Position = " + wayPoints[current_wayPoint+1].lat + ' ' + wayPoints[current_wayPoint + 1].lon);

        //The getDistance formula is accurate to 1 meter
        var start = wayPoints[current_wayPoint];
        distance = geolib.getDistance(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1],1,5);
        distance = geolib.convertUnit('cm',distance);
        currentHeading = geolib.getBearing(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1]);
        console.log("Current Distance: " + distance + "cm at a bearing of " + currentHeading);

        current_wayPoint++;
    //break;

    }
}
