# Titan Rover - ECS Demo of Mobility System

Simple React UI built to turn the rover through the UI by changing its current angle.

Dependencies:

- react-konva
- react-canvas-knob
- socket.io
- express

#### Online Demo

CodeSandbox: https://codesandbox.io/embed/9rYo4Yr2B?view=preview

----

### UI + Server

I added a small express & socket.io server to call the turn function when a user clicks a new degree value. I also included
a test file. Please replace lines 23-24 in Server.js with your code to turn the physical rover (e.g. call external script to execute function).

Inside the file you're calling your function from please include this at the top:

        var io = require('socket.io-client');
        var socketClient = io.connect('http://localhost:6993');

Then, in the specific function (e.g. performTurn) add this line of code at the very end:

        socketClient.emit('finished turning');

The data flow works like so: UI -> Server -> Mobility -> Server -> UI

A unidirectional flow where the UI is disabled until the rover finishes executing its turn.

### Running

To run this first navigate to the Server folder & start the local server: `node Server.js`

Then back in the root/main directory start the client web page: `npm start`