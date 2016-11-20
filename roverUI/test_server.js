var io = require('socket.io').listen(8000); // start io server at port 8000 to listen at
var sequence = 1;
var clients = [];

// Socket Events
// Event fired every time a new client connects:
io.on('connection', function(socketClient) {
    console.info('New client connected (id=' + socketClient.id + ').');
    clients.push(socketClient);

    // When socket disconnects, remove it from the list:
    socketClient.on('disconnect', function() {
        var index = clients.indexOf(socketClient);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client disconnected (id=' + socketClient.id + ').');
        }
    });
});

setInterval(function() {
    clients.forEach(function(socketClient) {
        io.to(socketClient.id).emit('update: chart data', [generateRandomData(), generateRandomData()]);
    });

}, 1000);

// random int between 100 to 500
function generateRandomData() {
    return Math.floor(Math.random() * 500);
}