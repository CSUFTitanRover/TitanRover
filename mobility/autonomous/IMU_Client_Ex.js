var net = require('net'),
  port = 9015,
  host = 'localhost'
  socket = net.createConnection(port, host);
  
socket.on('data', function(data) {
   console.log('received: ' + data);
   //console.log(typeof data);
   //console.log(JSON.parse(data));
   //data = data.split(" ");
   //for(var i = 0; i < data.length; i++){
   //	console.log(i + " " + data[1]);
   //}
});

socket.on('connect', function() {
    console.log('connected');
});

socket.on('SIGINT', function() {
    socket.exit();

});

socket.on('end', function() {
    console.log('closed');
});
