var net = require('net');
var client = new net.Socket();

// dummy command we would send to the runt
command = {
    dir: 'f',
    left_throttle: 0,
    right_throttle: 0
};

client.connect('./mysock', function() {
    console.log('Connected to mysocks server');
});

var timer = setInterval(function(){
    command.left_throttle++;
    command.right_throttle++; 
    if(command.left_throttle > 254){
        client.end();
        clearInterval(timer);
    }
    else{
        message = new Buffer(JSON.stringify(command)+'\n');
        client.write(message);
    }
},10);

// When we get a data packet from the python proc
client.on('data', function(data,err) { 
    if(err){
        console.log("Error!: " + JSON.stringify(err));
    }
    console.log('Received data: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});

