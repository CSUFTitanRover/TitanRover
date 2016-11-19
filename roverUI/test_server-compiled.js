'use strict';

var io = require('socket.io');
var ioServer = io.listen(8000);
var sequence = 1;
var clients = [];

// Event fired every time a new client connects:
ioServer.on('connection', function (socket) {
    console.info('New client connected (id=' + socket.id + ').');
    clients.push(socket);

    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function () {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client disconnected (id=' + socket.id + ').');
        }
    });
});

var counter = 1;
setInterval(function () {
    /*
    // Every 1 second, sends a message to a random client:
    var randomClient;
    if (clients.length > 0) {
        randomClient = Math.floor(Math.random() * clients.length);
        clients[randomClient].emit('message', sequence++);
    }*/

    if (clients.length > 0) {
        randomClientID = clients[Math.floor(Math.random() * clients.length)];

        console.info('Sending info to client id: ', randomClientID);
        ioServer.to(randomClientID.id).emit('message', 'This will be receieved randomly. Random Counter ID: ' + counter);
        counter++;
    }
}, 1000);

//# sourceMappingURL=test_server-compiled.js.map