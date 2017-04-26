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
        message = new Buffer(JSON.stringify(command));
        client.write(message);
    }
},10);

/* 
    This is just to show that bi-directional comm is possible. 
    We would only need to send back error message from the python process 
    during implentation. s
 */

client.on('data', function(data,err) { 
    if(err){
        console.log("Error!: " + JSON.stringify(err));
    }
    console.log('Received data: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});

