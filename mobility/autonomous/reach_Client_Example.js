var net = require('net'),
  port = 9001,
  host = '192.168.2.15'
  socket = net.createConnection(port, host);
  
socket
  .on('data', function(data) {
    console.log('received: ' + data);
  .on('connect', function() {
    console.log('connected');
  .on('end', function() {
    console.log('closed');
  });
