var io = require('socket.io').listen(8000); // start io server at port 8000 to listen at
var sequence = 1;
var clients = [];

// Socket Events
// Event fired every time a new client connects:
io.on('connection', function(socketClient) {
    //console.info('New client connected (id=' + socketClient.id + ').');
    clients.push(socketClient);

    // immediately request Client ID from the newly connected socket
    socketClient.emit('get: client id');

    // When socket disconnects, remove it from the list:
    socketClient.on('disconnect', function() {
        var index = clients.indexOf(socketClient);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client disconnected (id=' + socketClient.id + ').');
        }
    });

    socketClient.on('set: client id', function(clientID) {
        console.info('\nset: client id, CALLED');
        console.info('client id: ' + clientID);
        console.info('socketClientID: ' + socketClient.id)
    });
});

/*
setInterval(function() {
    clients.forEach(function(socketClient) {
        io.to(socketClient.id).emit('update: chart data', [generateRandomData(), generateRandomData()]);
    });

}, 500);
*/

// random int between 0 to 500
function generateRandomData() {
    return Math.floor(Math.random() * 500);
}