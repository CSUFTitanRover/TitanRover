const geolib = require('geolib');
const rover = require('./runt.js');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const autonomous_control = new MyEmitter();
const sleep = require('sleep');
const now = require("performance-now");
var sys = require('util');
var spawn = require("child_process").spawn;
var process = spawn('python',["IMU_Acc_Mag_Gyro.py"]);


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
rover.forward();
