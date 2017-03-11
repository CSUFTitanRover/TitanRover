var geolib = require('geolib');
//var rover = require('runt');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const autonomous_control = new MyEmitter();

var now = require("performance-now");
const Winston = require('winston');
 var winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
          timestamp: function () {
          return now().toFixed(2);},
          'colorize': true
          
     }),
      new (Winston.transports.File)({ 
          filename: './autonomous.log',
          options:{flags: 'w'}, // Overwrite logfile. Remove if you want to append 
          timestamp: function () {
          return now();},
     })
    ]
  });


var i = 0; 
var current_waypoint;
var current_heading = 45;
var target_waypoint; // The next waypoint to travel to
var distance_to_target;
const STOP_DISTANCE = 50; // Stop within 50m (change to cm during integration) of target 

/* 
You can plot these points here. Just copy paste. 
https://www.darrinward.com/lat-long/?id=2727099

33.64995,-117.612345
33.650316,-117.612109
33.6492,-117.610199
33.64945,-117.609674
33.650781,-117.611884
33.649968,-117.612367


To get your own test points you can use
http://www.findlatitudeandlongitude.com/click-lat-lng-list/

*/

var wayPoints = [
    {latitude: 33.64995,   longitude: -117.612345},
    {latitude: 33.64995,longitude: -117.612345},
    {latitude: 33.650316,longitude: -117.612109},
    {latitude: 33.6492,longitude: -117.610199},
    {latitude: 33.64945,longitude: -117.609674},
    {latitude: 33.650781,longitude: -117.611884},
    {latitude: 33.649968,longitude: -117.612367}
    ];


autonomous_control.on('on_target',function(target_waypoint){
    distance_to_target = geolib.getDistance(current_waypoint,target_waypoint);   
    //console.log("distance: " + distance_to_target);
    drive_toward_target();
});

autonomous_control.on('get_waypoint',function(){
    // Assuming the first point is the current waypoint. This wont be true for the runt. 
    current_waypoint = wayPoints[i];
    i++;
    if(i < wayPoints.length){
        target_waypoint = wayPoints[i];
        winston.info( 'Current Location: ' + JSON.stringify(current_waypoint));
        winston.info( 'Target Location: ' + JSON.stringify(target_waypoint));
        turn_toward_target();
    }
    else{
        console.log("Arrived at endpoint!");
        var end = now();
    }
    
});


/**
 * 
 * Uses the current heading and target to calculate which direction to turn.
 * If we are within 1 degree of the desired heading. stop.  
 * If not, take the shortest turn to get the desired heading. 
 */   

var turn_toward_target = function(){
    
    var turn_timer = setInterval(function(){

        target_heading = geolib.getBearing(current_waypoint,target_waypoint);
        heading_delta = current_heading - target_heading;
        //winston.log( 'Target heading: ' + target_heading);
        // If we are within 1 degree of the desired heading stop, else turn
        if(Math.abs(heading_delta) <= 1){
            //rover.stop();
            clearInterval(turn_timer);
            winston.info('Reached desired heading: ' + current_heading);
            autonomous_control.emit('on_target',target_waypoint);
        }
        else{
            winston.info('Turning..current heading: ' + current_heading + ' degrees');
            
            // We have to loop the degrees around manually for testing 
             if(current_heading < 0){
                 current_heading = 359;
             }

             if(current_heading > 360){
                 current_heading = 0;
             }

             // If we have turn more than halfway, its quicker to turn the other direction.
            // This can probably be simplified. Refactor later
             if(current_heading > target_heading){
                if(Math.abs(heading_delta) > 180){
                    //rover.turn_right();
                    current_heading = current_heading + 1;
                }else{
                    //rover.turn_left();
                    current_heading = current_heading - 1;
                    }
            }else{
                if(Math.abs(heading_delta) > 180){
                    //rover.turn_left();
                    current_heading = current_heading - 1;
                }else{
                    //rover.turn_right();
                    current_heading = current_heading + 1;
                    }
            }
           
        }
    },1);
};

/**
 * Updates current_distance while driving toward target
 */ 
var drive_toward_target = function(){
    
    previous_distance = null;
    var drive_timer = setInterval(function(){
        rover_overshot = false;
        if(previous_distance !== null){
            
            rover_overshot = distance_to_target > previous_distance;
        }
        if(distance_to_target < STOP_DISTANCE){
            //rover.stop();
            clearInterval(drive_timer);
            winston.info( 'Arrived...within ' + distance_to_target + ' meters');
            autonomous_control.emit('get_waypoint');
        } else if(rover_overshot){
                //rover.stop();
                clearInterval(drive_timer);
                winston.info( '**** Overshot: ' + distance_to_target);
                turn_toward_target(current_heading,target_waypoint);
        } else{
            //rover.forward(); 
            //distance_to_target = geolib.getDistance(current_waypoint,target);
            previous_distance = distance_to_target;
            distance_to_target--;
            winston.info( 'driving...distance to target: ' + distance_to_target + ' meters');
        }

    },1);

};


var start = now();

// Start the autonomous sequence.
autonomous_control.emit('get_waypoint');