/* MODIFIED TITAN ROVER MOBILITY SYSTEM
 *      Original Authors for Arduino:
 *        - William Zschoche
 *        - Paul Ishizaki
 *        - Justin Stewart
 *        - Bastian Awischus
 *      Javascript Adaptation & Modification for Johnny-five/BeagleBone:
 *        - Joe Edwards
 *
 *      TODO:
 *          1. Meaningful Variable Names
 *          2. Meaningful console statements
 *          3. Testing with Motors.
 *          4. Commenting/Formatting to standard
 *          5. Efficiency adjustments
 */

'use strict';
var bone = require('bonescript');
var five = require('johnny-five');
var micros = require('microseconds');
var board = new five.Board();

/*
 *   Input pins from X8R radio receiver.
 */
var CONTROL_X_IN_PIN = 10;     //ch. 1
var CONTROL_Y_IN_PIN = 11;     //ch. 2

/*
 *  Output pins for wheels to ESC.
    valid PWM output pins(MEGA 2560): 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                      44, 45, 46
*/
var FRONT_LEFT_ESC_OUT_PIN = 2;   //Front Left ESC
var FRONT_RIGHT_ESC_OUT_PIN = 3;   //Front Right ESC
var BACK_LEFT_ESC_OUT_PIN = 4;   //Back Left ESC
var BACK_RIGHT_ESC_OUT_PIN = 5;   //Back Right ESC

/*
 *  Binary "flag" values for interrupts.
 */
var CONTROL_X_FLAG = 1;
var CONTROL_Y_FLAG  = 2;

/*
 *  Signal limiting constants. Maximum allowable signals for forward and
 *  reverse throttle.
 *
 *  Note: Throttle is further limited in ESC firmware profile TITAN_ROVER. to a maximum of 25%.
 *
 */
var MAX_FORWARD = 1750;      //Max forward throttle
var MAX_REVERSE = 1250;      //Max reverse throttle

var CONTROL_XY_SHARED_FLAG;

var usJLYInShared;
var usJLXInShared;

var CONTROL_Y_START_TIME;
var CONTROL_X_START_TIME;

var X_COORD;
var Y_COORD;

/*
 *  ESC Declarations
 *
 *  Note: Other fields can be passed to ESCs if neccessary.
 *      See documentation:
 *
 */
console.log("Initializing ESCs:")
var MOTOR_FRONT_LEFT = new five.ESC(
    {
        pin: FRONT_LEFT_ESC_OUT_PIN,
        device: 'FORWARD_REVERSE',
        startAt: 0
    }
);
console.log(' -- FRONT LEFT');
console.log(MOTOR_FRONT_LEFT);
var MOTOR_FRONT_RIGHT = new five.ESC(
    {
        pin: FRONT_RIGHT_ESC_OUT_PIN,
        device: 'FORWARD_REVERSE',
        startAt: 0
    }
);
console.log(' -- FRONT RIGHT');
console.log(MOTOR_FRONT_RIGHT);
var MOTOR_BACK_LEFT = new five.ESC(
    {
        pin: BACK_LEFT_ESC_OUT_PIN,
        device: 'FORWARD_REVERSE',
        startAt: 0
    }
);
console.log(' -- BACK LEFT');
console.log(MOTOR_BACK_LEFT);
var MOTOR_BACK_RIGHT = new five.ESC(
    {
        pin: BACK_RIGHT_ESC_OUT_PIN,
        device: 'FORWARD_REVERSE',
        startAt: 0
    }
);
console.log(' -- BACK RIGHT');
console.log(MOTOR_BACK_RIGHT);


var calculatePositiveVariable = function(x, y) {
  return (100-Math.abs(x))*(y/100)+y;
}

var calculateNegativeVariable = function(x, y) {
  return (100-Math.abs(y))*(x/100)+x;
}

var calculateRightPower = function(v, w) {
  return (v+w)/2;
}

var calculateLeftPower = function(v, w) {
  return (v-w)/2;
}

var setSpeedLeft = function(value) {
    control = j5Translate(value);
    MOTOR_FRONT_LEFT[control.direction](control.speed);
    MOTOR_BACK_LEFT[control.direction](control.speed);
}

var setSpeedRight = function(value) {
    control = j5Translate(value);
    MOTOR_FRONT_RIGHT[control.direction](control.speed);
    MOTOR_BACK_RIGHT[control.direction](control.speed);
}

// Calculate
var yInputInterrupt = function() {
    if(bone.digitalRead(CONTROL_Y_IN_PIN) == HIGH)
    {
    CONTROL_Y_START_TIME = microseconds();
    }
    else
    {
    usJLYInShared = microseconds() - CONTROL_Y_START_TIME);
    CONTROL_XY_SHARED_FLAG |= CONTROL_Y_FLAG;
    }
}

var xInputInterrupt = function(){
    if (bone.digitalRead(CONTROL_X_IN_PIN) === HIGH) {
        CONTROL_X_START_TIME = microseconds();
    }
    else {
        usJLXInShared = (microseconds() - CONTROL_X_START_TIME);
        CONTROL_XY_SHARED_FLAG |= CONTROL_X_FLAG;
    }
}

var microseconds = function(){
    return (micros.parse(micros.now().microseconds)
};

var deactivateInterrupts = function(){
    bone.detachInterrupt(CONTROL_Y_IN_PIN);
    bone.detachInterrupt(CONTROL_X_IN_PIN);
};

var activateInterrupts = function(){
    bone.attachInterrupt(CONTROL_Y_IN_PIN, true, yInputInterrupt, CHANGE);
    bone.attachInterrupt(CONTROL_X_IN_PIN, true, xInputInterrupt, CHANGE);
};

var j5Translate = function(speed){
    var direction;
    if (speed > 1500) {
        direction = "forward";
        speed = mapVariableRange(speed, 1500, 2000, 0, 100);
    }
    else {
        direction = "reverse";
        speed = mapVariableRange(speed, 1500, 2000, 0, 100);
    }
    return {speed: speed, direction: direction};
}

var mapVariableRange = function(x, inMin, inMax, outMin, outMax) {
    // Can replace with five.FN.map()?
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

board.on('ready', funtion(){
    this.loop(1, function(){
        console.log("Setting Interrupts");
        activateInterrupts();

        var updateFlags;

        var usJLYIn;
        var usJLXIn;

        var powerLeft;
        var powerRight;

        var propLeft;
        var propRight;

        var v;
        var w;

        if(CONTROL_XY_SHARED_FLAG) {
            deactivateInterrupts();

            updateFlags = CONTROL_XY_SHARED_FLAG;
            //check for y-input interrupt
            if(updateFlags & CONTROL_Y_FLAG) {
            usJLYIn = usJLYInShared;
            }
            //check for x-input interrupt
            if(updateFlags & CONTROL_X_FLAG) {
            usJLXIn = usJLXInShared;
            }

            CONTROL_XY_SHARED_FLAG = 0;

            activateInterrupts();
        }

        if(updateFlags & (CONTROL_X_FLAG || CONTROL_Y_FLAG)) {
            if(usJLXIn < 1000) {
                usJLXIn = 1000;
            }
            else if(usJLXIn > 2000) {
                usJLXIn = 2000;
            }
            if(usJLYIn < 1000) {
                usJLYIn = 1000;
            }
            else if(usJLYIn > 2000) {
                usJLYIn = 2000;
            }

            // >>>> https://www.arduino.cc/en/Reference/Map
            X_COORD = mapVariableRange(usJLXIn, 1000, 2000, -100, 100);
            Y_COORD = mapVariableRange(usJLYIn, 1000, 2000, -100, 100);

            /*  THIS IS THE STEERING PROBLEM!!!
            if (Math.abs(X_COORD) < 10)
            X_COORD = 0;
            if (Math.abs(Y_COORD) < 10)
            Y_COORD = 0;
            */

            X_COORD *= -1;

            v = calculatePositiveVariable(X_COORD, Y_COORD);

            w = calculateNegativeVariable(X_COORD, Y_COORD);

            propRight = calculateRightPower(v, w);

            propLeft = calculateLeftPower(v, w);

            if(propRight < 0) {
                powerRight = 1500 - ((1500 - MAX_REVERSE)*(Math.abs(propRight)/100));
            }
            else {
                powerRight = 1500 + ((MAX_FORWARD - 1500)*(propRight/100));
            }

            if(propLeft < 0) {
                powerLeft = 1500 - ((1500 - MAX_REVERSE)*(Math.abs(propLeft)/100));
            }
            else {
                powerLeft = 1500 + ((MAX_FORWARD - 1500)*(propLeft/100));
            }
        }

        setSpeedRight(powerRight);
        setSpeedLeft(powerLeft);

        updateFlags = false;
    }
});
