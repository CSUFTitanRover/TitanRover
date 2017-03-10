var geolib = require('geolib');
var runt = require('runt');

var current_waypoint;
var current_heading;

var next_waypoint; 
var distance_to_waypoint;


/**
 * @param {JSON} current_heading current longitude and latitude 
 * @param {JSON} next_waypoint next longitude and latitude, ideal destination
 */   
var turn_to_heading = setInterval(function(current_heading, next_waypoint){
        heading_delta =current_heading - geolib.getBearing(current_waypoint,next_waypoint);
        delta_isPositve = heading_delta > 0;
        // If we are within 1 degree of the desired heading
        if(Math.abs.apply(heading_delta) <= 1){
            runt.stop();
            clearInterval(check_heading);
        }
        else{
             take_shortest_turn(heading_delta,delta_isPositive);
        }
    },200);

/**
 * @param {Number} distance_to_waypoint The INITIAL distance to way point 
 */ 
var drive_to_next = setInterval(function(distance_to_waypoint){
    
    previous_distance = null;
    rover_overshot = previous_distance < distance_to_waypoint;

    // if distance to next is less than 50cm
    if(distance_to_waypoint < 50){
        runt.stop();
        clearInterval(drive_to_next);
    } else if(rover_overshot){
            runt.stop();
            turn_to_heading();
    } else{
        runt.drive();
        distance_to_waypoint = geolib.getDistance(current_waypoint,next_waypoint);
    }
},200);

/* HELPER FUNCTIONS */
// If we have to move more than half a turn. Its quicker to move the other direction. 
// This can probably be simplified. Refactor later 
function take_shortest_turn(heading_delta,delta_is_positive){  
    if(delta_is_positive){
        if(Math.abs(heading_delta) > 180){
            runt.turn_left();
        }else{
            runt.turn_right();
            }
    }else{
        if(Math.abs(heading_delta) > 180){
            runt.turn_left();
        }else{
            runt.turn_right();
            }
        }
}
