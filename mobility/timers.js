var geolib = require('geolib');
var rover = require('runt');
var winston = require('winston');


var current_waypoint;
var current_heading;

var target; // The next waypoint to travel to
var distance_to_target;

const STOP_DISTANCE = 50; // Stop within 50cm of target 


/**
 * @param {JSON} current_heading current heading in degrees. Ranges from 0 - 360 
 * @param {JSON} target destination longitude and latitude
 * 
 * Uses the current heading and target to calculate which direction to turn.
 * If we are within 1 degree of our desired heading. stop.  
 * If not, take the shortest clockwise or counter clockwise turn. 
 */   

var turn_toward_target = setInterval(function(current_heading, target){
        heading_delta = current_heading - geolib.getBearing(current_waypoint,target);
        delta_is_positive = heading_delta > 0;
        // If we are within 1 degree of the desired heading stop, else turn
        if(Math.abs(heading_delta) <= 1){
            rover.stop();
            clearInterval(turn_toward_target);
        }
        else{
            // If we have turn more than halfway in one direction, its quicker to move the other direction.
            // This can probably be simplified. Refactor later
             if(delta_is_positive){
                if(Math.abs(heading_delta) > 180){
                    rover.turn_left();
                }else{
                    rover.turn_right();
                    }
            }else{
                if(Math.abs(heading_delta) > 180){
                    rover.turn_left();
                }else{
                    rover.turn_right();
                    }
                }
            }
    },200);


/**
 * @param {Number} distance_to_target The INITIAL distance to way point 
 * 
 * Uses the intial distance to next waypoint.
 */ 
var drive_toward_target = setInterval(function(current_waypoint,distance_to_target,target){
    
    previous_distance = null;
    rover_overshot = false;
    if(previous_distance !== null){
        rover_overshot = current_distance_to_target > previous_distance;
    }
    
    if(current_distance_to_target < STOP_DISTANCE){
        rover.stop();
        clearInterval(drive_toward_target);
    } else if(rover_overshot){
            rover.stop();
            turn_toward_target();
    } else{
        rover.forward();
        current_distance_to_target = geolib.getDistance(current_waypoint,target);
    }
},200);