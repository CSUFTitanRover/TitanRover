
var dualShock = require('dualshock-controller');
//var gamepad = require("gamepad");
 

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


//DualShock 3 control rumble and light settings for the controller
// controller.setExtras({
//   rumbleLeft:  0,   // 0-1 (Rumble left on/off)
//   rumbleRight: 0,   // 0-255 (Rumble right intensity)
//   led: 2 // 2 | 4 | 8 | 16 (Leds 1-4 on/off, bitmasked)
// });

//add event handlers:
controller.on('left:move', data => console.log('left Moved: ' + data.x + ' | ' + data.y));

controller.on('right:move', data => 
{

console.log('right Moved: ' + data.x + ' | ' + data.y);
    
});

controller.on('connected', () => console.log('connected'));

controller.on('square:press', ()=> console.log('square press'));

controller.on('square:release', () => console.log('square release'));

controller.on('x:press', ()=> console.log('x press'));
controller.on('x:release', () => console.log('x release'));

controller.on('triangle:press', () => console.log('triangle release'));
controller.on('triangle:release', () => console.log('triangle release'));

controller.on('circle:press', () => console.log('circle release'));
controller.on('circle:release', () => console.log('circle release'));

//sixasis motion events:
//the object returned from each of the movement events is as follows:
//{
//    direction : values can be: 1 for right, forward and up. 2 for left, backwards and down.
//    value : values will be from 0 to 120 for directions right, forward and up and from 0 to -120 for left, backwards and down.
//}


// //right-left movement
// controller.on('rightLeft:motion', data => console.log(data));

// //forward-back movement
// controller.on('forwardBackward:motion', data => console.log(data));

// //up-down movement
// controller.on('upDown:motion', data => console.log(data));

//controller status
//as of version 0.6.2 you can get the battery %, if the controller is connected and if the controller is charging
controller.on('battery:change', data => console.log(data));

controller.on('connection:change', data => console.log(data));

controller.on('charging:change', data => console.log(data));

