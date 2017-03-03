var GamePad = require( 'node-gamepad' );
var controller = new GamePad( 'supported/controller/here' );
controller.connect();
 
controller.on( 'up:press', function() {
    console.log( 'up' );
} );
controller.on( 'down:press', function() {
    console.log( 'down' );
} );

controller.on( '{name:move', function() {
    console.log( 'down' );
} );
