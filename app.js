/*
  Author: Shan Liyanage

  Titan Rover - Linear Actuator controller 

  Description: 
    
    Controlling a linear actuator with a joystick. 
    
    Potentiometer values will be displayed graphically on a 
    separate web page in real time
*/

var pubnub = require('pubnub');
var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {
  
  // Initializing linear actuator pins 
  var in8 = new five.Pin(10);
  var in7 = new five.Pin(11);

  // Initializing joystick pin Range ( 0 - 1023)
  var pin = new five.Pin(2);
  
  // The joystick is in the neutral position ~ between 500 - 530 
  var lBound = 500; 
  var uBound = 530; 


  // PubNub Stuff
  var potentiometer; 
  var channel = 'arduino_output';

  var pub = new pubnub({
    publish_key: 'pub-c-a72e78c9-93be-4e27-bf0c-f451ae2e4bf6',
    subscribe_key: 'sub-c-e1e6b59e-7495-11e6-80e7-02ee2ddab7fe'
});


/* Limits for pot on actuator 
    Low: ~50
    High: ~990
*/

/* 

  Reading values from the joystick  
    
    If the joystick is position up, send signal to expand.
    If down, send signal to contract
    if neutral, stop actuator. 

*/
  
  this.analogRead(2, function(voltage){
  
    if(voltage > uBound){
      
      in7.low();
      in8.high();
      console.log("Y Value: " + voltage);
    }
    else if(voltage < lBound){
        in7.high();
        in8.low();
        console.log("Y Value: " + voltage);
    }
    else {
       in7.low();
       in8.low()
       
    }
    
  })

 // Reading values from the actuators potentiometer
 
  this.analogRead(4, function(vol){
      potentiometer = vol;
      console.log("Pot voltage:" + vol);

    })

// Sending voltage to pubnub server 
// setInterval(publish, 3000);

// function publish() {
//   var data = {
//     'voltage': potentiometer,
//   };
//   pub.publish({
//     channel: channel,
//     message: data,
//   });
// }


 

});
