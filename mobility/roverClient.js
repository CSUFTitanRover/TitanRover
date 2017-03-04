'use strict';
var geolib = require('./geolib/geolib');
var wayPoints = [
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
        console.log(wayPoints[current_wayPoint].lat + ' ' + wayPoints[current_wayPoint].lon);
        console.log(wayPoints[current_wayPoint+1].lat + ' ' + wayPoints[current_wayPoint + 1].lon);

        //The getDistance formula is accurate to 1 meter
        var start = wayPoints[current_wayPoint];
        distance = geolib.getDistance(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1],1,5);
        distance = geolib.convertUnit('cm',distance);
        currentHeading = geolib.getBearing(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1]);


        current_wayPoint++;
    //break;

    }
}

/*

North1foot  = -0.00000824 //Latitude  only   0Degrees
South1foot  =  0.00000824 //Latitude  only 180Degrees
East1foot   = -0.0000099  //Longitude only  90Degrees
West1foot   =  0.0000099  //Longitude only 270Degrees

increase in the fifth decimal place of longitude +-1 is 3.02263779528 feet off
increase in the fifth decimal place of longitude +-1 is 3.6482939633 feet off


while(true){
    if(list)
        //else get list
        currentHeading = IMU
        current lat & long = Reach_coords
        calc needed heading
        decide turn direction < 180
        calc distance
        //calc time
        currentHead = call mobilityturn(left/right, heading)
        getDistance to lat / long - mobilitydrive(lat, long, distance)

        if(distance < 2m)
            list nextwaypoint
    else
        final point reached
        exit loop
}

Tennis ball Tracking start


function mobilityturn(left/right, heading)
    while(Headingneeded <= current head IMU)
        turn
    return current_head


function reach_coords
    return


function mobility_drive(startHead, distance)
    while(distance to point > new distance && heading-2 < starting heading && start_heading < heading +2
        distance_to_point = new distance
        drive forward
        sleep(100)
        currentCoords = reach_coords
        distance = geolid distance
        heading = geolib heading
    return(distance, lat, long)


 */
