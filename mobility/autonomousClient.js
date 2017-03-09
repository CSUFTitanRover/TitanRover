/*
*****ATLAS ROVER AUTONOMOUS CLIENT*****
Written by:
Brandon Hawkinson
Shan Lineage
Timothy Parks
*****DESCRIPTION*****
Primary autonomous controller for the Atlas Rover system. Running this script should activate the autonomous mode until
the rover completes the autonomous traversal task. 
*****EXCESS DETAILS*****
North1foot  = -0.00000824 //Latitude  only   0Degrees
South1foot  =  0.00000824 //Latitude  only 180Degrees
East1foot   = -0.0000099  //Longitude only  90Degrees
West1foot   =  0.0000099  //Longitude only 270Degrees

increase in the fifth decimal place of longitude +-1 is 3.02263779528 feet off
increase in the fifth decimal place of longitude +-1 is 3.6482939633 feet off
 */

'use strict';

/*****DEPENDENCIES*****/
var geolib = require('./geolib/geolib');
/**********************/

/*****LOGIC VARIABLES*****/
var autonomousMode = true;
/*****END LOGIC VARIABLES*****/

/*****TEMPORARY WAYPOINTS FOR TESTING *****/
var wayPoints = [
    {lat: 34.052222,   lon: -118.243611},//Los Angeles, CA (34.052222, -118.243611) start position
    {lat: 36.116800,   lon: -115.173798},//las vegas dist = 36167300 cm. @49.42Degrees
    {lat: 32.783056,   lon: - 96.806667}, //dallas, tx dist = 172504700 cm @97.0808Degress
    {lat: 39.778889,   lon: -104.982500},//Denver, CO (39.778889, -104.9825) is 106775300 cm. 319.0676Degrees
    {lat: 34.052222,   lon: -118.243611},//Los Angeles, CA (34.052222, -118.243611) is 133974200 cm 245.74Degrees
    {lat: 40.715517,   lon: - 73.999100}];//New York City, NY (40.715517, -73.9991) is 394497600 cm 65.91361Degrees
var current_wayPoint = 0;
/*****END TEMP WAYPOINTS*****/

/*****WAYPOINT RETRIEVAL*****/
//TODO: Implement array of waypoints to store waypoint objects on startup*/
let waypoints = []; //store waypoints, preferbly from a file generated from walking the course. 
/*****/

/*****ATLAS ROVER*****/
var atlas = new Atlas;
class Atlas {
    constructor(){
        let myLon = 0;
        let myLat = 0;
        let left = false;
        let right = false;
        let forward = false;
        let backward = false;
        this.getMyCoordinates = this.getMyCoordinates.bind(this);
        this.getMyHeading = this.getMyHeading.bind(this);
        this.getMyCoordinates = this.getMyCoordinates.bind(this);
    }

    getMyCoordinates() {
        console.log("--ATLAS REQUESTING CURRENT GPS COORDINATES--")
        //call reach for GPS Coordinates
        //myLat = 
        //myLon = 
    }

    getMyBearing() {
        console.log("--ATLAS REQUESTING BEARING--")
        //get IMU data, and/or reach IMU
        //return data
        if (forward || backward) {
            //reading is logged by the getBearing() function inheritantly, no need to get it twice.
            return getBearing();
            r
        }
    }

    /*Move function will execute the mobility systems to drive the rover in the proper direction*/
    move(left, right, forward, backward) { //should take booleans, for example if right, move(false,true,false,false)
        console.log("--ATLAS EXECUTING A MOVEMENT COMMAND--");
        if (!left && !right && !forward && !backward) {
            console.log("--STOPPING--")
        }
        else if(left) {
            console.log("--ROTATING LEFT--");
            //TODO Implement movement functions
        }
        else if (right) {
            console.log("--ROTATING RIGHT--");
            //TODO Implement movement functions
        }
        else if (forward) {
            console.log("--DRIVE FORWARD--");
            //TODO Implement movement functions
        }
        else if (backward) {
            console.log("--DRIVE BACKWARD--");
            //TODO Implement movement functions
        } else {
            console.log("--NO MOVEMENT EXECUTED--");
        }
    }

    /*Stops all motors at 0 to bring the rover to a halt*/
    stopMove() {
        console.log("--ATLAS EXECUTING STOP--")
        move(false,false,false,false);
        console.log("--EXECUTED STOP--");
    }
    
    get myHeading() {
        //return geolib calc or IMU calc
    }

}
/*****/
/*****GEOLIB FUNCTIONS*****/
//ALL FUNCTIONS CURRENTLY IMPLEMENTED FOR TEMPORARY WAYPOINTS
function getDistance() {
    //need to switch bearing to be between my lat/lon vs current_wayPoint
    let tempDistance = geolib.getDistance(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1],1,5);
    this.tempDistance = geolib.convertUnit('cm', tempDistance);
    console.log("DISTANCE: " + this.tempDistance); //for debugging purposes
    return this.tempDistance;
}
function getCurrentBearing() {
    let currentBearing = geolib.getBearing()
    console.log("ATLAS BEARING: " + this.currentBearing); //for debugging purposes
    return this.currentBearing;
}
function getTargetBearing() {
    //need to switch bearing to be between my lat/lon vs current_wayPoint
    targetBearing = geolib.getBearing(wayPoints[current_wayPoint],wayPoints[current_wayPoint+1]);
    console.log("TARGETBEARING: " + this.targetBearing); //for debugging purposes
    return this.targetBearing;
}
function getChangeInBearing() {
    let currentBearing = atlas.getMyBearing();
    let targetBearing = getTargetBearing();
}
/*****/

/*****OBSERVER IMPLEMENTATION*****/
//USE THIS LOOP TO IMPLEMENT CIRCULAR LOGIC FOR AUTONOMOUS LOOP
/*
****PSUEDO CODE****
-Observer grabs the first waypoint to be executed. 
-Once grabbed, use getChangeInBearing() to calculate the direction we need to turn
-Execute the proper turn command based upon which direction getChangeInBearing() returns, 0 > -180 for right and 0 <= 180 for left;
-While turning, constantly call getChangeInBearing() until it is within our margin of error
-Once within margin of error call for the rover to stop movement
??Make minor heading adjustments if needed for precisions??
-use getDistance() to calculate our current distance between the rover and the waypoint. 
-execute forward movement
-use getDistance() to check your distance constantly, use getChangeInBearing() to check for deviations in bearing from our target
-if our getChangeInBearing() is outside of our margin of error, execute rover stop and execute a left or right movement to correct it. 
-Once arrived at the current waypoint, notify the basestation 
-Iterate to the next waypoint if there is one. If there is one execute the loop again. 
-If no waypoint found, notify the basestation that the rover has arrive at it's final waypoint. 
-If the rover is on it's final leg, hand commands over to the objectRecognitionClient.js to approach the tennis ball
*/
while (autonomousMode) {

}
/*****/