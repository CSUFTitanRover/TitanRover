
var dualShock = require('dualshock-controller');
var diffSteer = require('diff-steer');

diffSteer.maxAxis = 255;
diffSteer.minAxis = 0;

//var gamepad = require("gamepad");
 
const saber_min = 241; // Calculated to be 1000 us
const saber_mid = 325; // Calculated to be 1500 us
const saber_max = 409; // Calculated to be 2000 us

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

//pass options to init the controller.
var controller = dualShock(
    {
        config : "dualShock3",
        //smooths the output from the acelerometers (moving averages) defaults to true
        accelerometerSmoothing : true,
        //smooths the output from the analog sticks (moving averages) defaults to false
        analogStickSmoothing : false
    });

//make sure you add an error event handler
controller.on('error', err => console.log(err));



const config = {
    commandType: "control",
    type: "config",
    Joystick_MAX: 127.5,
    Joystick_MIN: -127.5,
    arm_on: true,
    mobility_on: true,
    debug: false
}

function calculateDiff(yAxis, xAxis) {
    //xAxis = xAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);
    //yAxis = yAxis.map(Joystick_MIN, Joystick_MAX, 100, -100);

    //xAxis = xAxis * -1;
  
    yAxis = yAxis * -1;
    xAxis = xAxis * -1;
    var V = (config.Joystick_MAX - Math.abs(xAxis)) * (yAxis / config.Joystick_MAX) + yAxis;
    var W = (config.Joystick_MAX - Math.abs(yAxis)) * (xAxis / config.Joystick_MAX) + xAxis;
    var right = (V + W) / 2.0;
    var left = (V - W) / 2.0;

   

    if (right <= 0) {
        right = right.map(config.Joystick_MIN, 0, saber_min, saber_mid);
    } else {
        right = right.map(0, config.Joystick_MAX, saber_mid, saber_max);
    }

    if (left <= 0) {
        left = left.map(config.Joystick_MIN, 0, saber_min, saber_mid);
    } else {
        left = left.map(0, config.Joystick_MAX, saber_mid, saber_max);
    }
    console.log(left + ' ' + right);
    return {
        "leftSpeed": left,
        "rightSpeed": right
    };
}

function myDiff(x_axis,y_axis){
 
 // filter out a centered joystick - no action
  if (x_axis < 126 || x_axis > 128) {
    if (y_axis < 126 || y_axis > 128) {
      // Map values from potentiometers to a smaller range for the PWM motor controllers (0-255)
      x_axis = x_axis.map(0,255, saber_min, saber_max);
      y_axis = y_axis.map(0,255, saber_min, saber_max);
      
      let ly_axis = y_axis;
      let ry_axis = y_axis;

      if (x_axis < saber_mid-2) { // turning left, so slow-down left track
        if (y_axis > saber_mid+2) { // moving forward
          ly_axis -= (saber_max - x_axis); // decreasing the value - moving it closer to the center-point - slows it down
        }

        if (y_axis < saber_mid-2) { // moving in reverse
          ly_axis += (saber_max - x_axis); // increasing the value - moving it closer to the center-point - slows it down
        }
      }

      if (x_axis < saber_mid+2) { // turning right, so slow-down right track
        if (y_axis > saber_mid+2) { // moving forward
          ry_axis -= (saber_max - x_axis); // decreasing the value - moving it closer to the center-point - slows it down
        }

        if (y_axis < saber_mid-2) { // moving in reverse
          ry_axis += (saber_max - x_axis); // increasing the value - moving it closer to the center-point - slows it down
        }
      }

     console.log(ly_axis + ' ' + ry_axis);
    }
  }
}




controller.on('right:move', function(data){
    //console.log(data.x +' ' + data.y);
    // myDiff(data.x,data.y);  
    calculateDiff(data.y-127.5,data.x-127.5);
    
});