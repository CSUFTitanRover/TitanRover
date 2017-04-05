/*
  Titan Rover - Autonomous 
  Description:
        Globals: current_location and target_location
  
MAGNETIC DECLINATION 
    Mars Desert Research Station UT 
    Latitude: 38° 24' 44.3" N
    Longitude: 110° 48' 20.5" W
    Magnetic declination: +10° 44' 
    Declination is POSITIVE (EAST)
    Inclination: 64° 10' 
    Magnetic field strength: 50629.5 nT
    
    Fullerton
    Latitude: 33° 52' 54.5" N
    Longitude: 117° 52' 57.4" W
    Magnetic declination: +11° 57' 
    Declination is POSITIVE (EAST)
    Inclination: 58° 47' 
    Magnetic field strength: 46862.8 nT
*/

const geolib = require('geolib');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const autonomous_control = new MyEmitter();
const sleep = require('sleep');
const now = require("performance-now");
var sys = require('util');
var spawn = require("child_process").spawn;
var process = spawn('python',["IMU_Acc_Mag_Gyro.py"]);
var rover = require('./runt_pyControl.js');



const Winston = require('winston');
const winston = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({
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
const STOP_DISTANCE = 2; // Stop within 2m of target (change to cm during integration)
const MAX_HEADING_ERROR = 10; 
const UNITS = ' meter(s)';

var turn_timer;
var drive_timer;
/* 
You can plot these points on a map here. 
https://www.darrinward.com/lat-long/?id=2727099

Just copy paste. 

33.64995,-117.612345
33.650316,-117.612109
33.6492,-117.610199
33.64945,-117.609674
33.650781,-117.611884
33.649968,-117.612367


To get your own test points you can use
http://www.findlatitudeandlongitude.com/click-lat-lng-list/

*/

var net = require('net');
var HOST = '192.168.43.207';
var PORT = 9005;


var client = new net.Socket();

client.connect(PORT, HOST, function () {
    console.log('Connected to Server');
});

client.on('data', function (data) {
    var arr = data.toString().split(" ");
    current_waypoint = {latitude: Number(arr[4]), longitude: Number(arr[5])};
    //Uncommit next line for error checking output of Rover:Reach server
    //console.log('Waypoint Latitude: ' + bufPoint.lat + ' and Longitude: ' + bufPoint.lon);
});

client.on('close', function() {
    client.end();
});

// Getting Heading
process.stdout.on('data', function (data){
    current_heading = data.toString();
    console.log('Current heading: ' + current_heading);
});


var wayPoints = [
    {latitude: 33.64995,   longitude: -117.612345},
    {latitude: 33.64995,longitude: -117.612345},
    {latitude: 33.650316,longitude: -117.612109},
    {latitude: 33.6492,longitude: -117.610199},
    {latitude: 33.64945,longitude: -117.609674},
    {latitude: 33.650781,longitude: -117.611884},
    {latitude: 33.649968,longitude: -117.612367}
    ];

autonomous_control.on('stop',function(){ 
    clearInterval(turn_timer);
    clearInterval(drive_timer);
    winston.info( 'Stop command received');
});

autonomous_control.on('on_target',function(target_waypoint){ 
    //console.log("distance: " + distance_to_target);
     winston.info('Reached desired heading: ' + current_heading + ' degrees');
     winston.info('Initiating drive toward waypoint ' + (i-1) + ", " +JSON.stringify(target_waypoint));
     sleep.sleep(3);
     process.stdout.write('\033c');
     drive_toward_target();
});

autonomous_control.on('get_waypoint',function(){
    // Assuming the first point is the current waypoint. This wont be true during testings.
    current_waypoint = wayPoints[i];
    i++;
   
    if(i < wayPoints.length){
        target_waypoint = wayPoints[i];
        distance_to_target = geolib.getDistance(current_waypoint,target_waypoint);  
        winston.info( 'Getting target location');
        winston.info( 'Current Location: ' + JSON.stringify(current_waypoint));
        winston.info( 'Target Location: ' + JSON.stringify(target_waypoint));
        sleep.sleep(3);
        process.stdout.write('\033c');
        
        if(distance_to_target < STOP_DISTANCE){
            winston.info( 'Already at waypoint. Skipping.');
            autonomous_control.emit('get_waypoint');
        }
        else{
            turn_toward_target();
        }
    }
    else{
        winston.info("Arrived at endpoint! Total travel time: " + ((now()-start)/1000).toFixed(2) + " seconds");
    }
    
});

/**
 * Turns and constantly checks if within reasonable heading error 
 */   

var turn_toward_target = function(){
    winston.info('Initiating turn');
    previous_heading_delta = null; 
    target_heading = geolib.getBearing(current_waypoint,target_waypoint);
    
    if(current_heading > target_heading){
        if(Math.abs(heading_delta) > 180){
            rover.turn_right();
        }else{
            rover.turn_left();
            }
    }else{
        if(Math.abs(heading_delta) > 180){
            rover.turn_left();
        }else{
            rover.turn_right();
        }
    }
    turn_timer = setInterval(function(){
        process.stdout.write('\033c');
        winston.info( 'Turning ... Current heading: ' + current_heading + ' Target heading: ' + target_heading.toFixed(2));
        heading_delta = current_heading - target_heading;   
        // If we are within x degrees of the desired heading stop, else check if we overshot
        if(Math.abs(heading_delta) <= 5){
            rover.stop();
            clearInterval(turn_timer);
            autonomous_control.emit('on_target',target_waypoint);
        }
        else if(previous_heading !== null && previous_heading_delta < heading_delta){
            clearInterval(turn_timer);
            turn_toward_target();
        }
        previous_heading_delta = heading_delta; 
    },15);
};

/**
 * The rover will drive towards target until it reaches the target or moves further away from the target
 */ 
var drive_toward_target = function(){  
    rover.drive_forward();
    previous_distance = null;
    
    drive_timer = setInterval(function(){
        off_target = false;
        target_heading = geolib.getBearing(current_waypoint,target_waypoint);
        heading_delta = current_heading - target_heading;
        distance_to_target = geolib.getDistance(current_waypoint,target);
        
        if(previous_distance !== null){
            off_target = distance_to_target > previous_distance;
            bad_heading = heading_delta > MAX_HEADING_ERROR; 
        }

        if(off_target){
            rover.stop();
            clearInterval(drive_timer);
            winston.warn( 'Overshot target by ' + distance_to_target + UNITS);
            turn_toward_target(current_heading,target_waypoint);
        }
        else if(bad_heading){
            if(current_heading > target_heading){
                let scaled_error_correction = heading_delta/180; 
                if(Math.abs(heading_delta) > 180){
                    rover.slight_right(scaled_error_correction);
                }else{
                    rover.slight_left(scaled_error_correction);
                }
            }else{
                if(Math.abs(heading_delta) > 180){
                    rover.slight_left(scaled_error_correction);
                }else{
                    rover.slight_right(scaled_error_correction);
                }
    }
        }else if(distance_to_target < STOP_DISTANCE){
            rover.stop();
            clearInterval(drive_timer);
            winston.info( 'Arrived...within ' + distance_to_target + UNITS);
            sleep.sleep(2);
            process.stdout.write('\033c');
            autonomous_control.emit('get_waypoint');
        }else {
            previous_distance = distance_to_target;
            process.stdout.write('\033c');
            winston.info('driving...distance to target: ' + distance_to_target + UNITS);
        }
    },15);
};


process.stdout.write('\033c');
winston.info('Starting autonomous navigation');
var start = now();
autonomous_control.emit('get_waypoint');
