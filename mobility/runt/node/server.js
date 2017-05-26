#!/usr/bin/env node
var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jsonfile = require('jsonfile');
var file = '/home/pi/TitanRover/mobility/runt/node/gps.json';

app.get('/', function(req,res){
    res.sendFile(__dirname + '/map.html');
});
	
io.on('connection',function(socket){
        
    console.log('a user connected');

    socket.on('disconnect',function(){
        console.log('a user disconnected');
    });
    
    // Refresh rate is 1000 ms, 
    setInterval(function(){
        jsonfile.readFile(file, function(err, obj){
            console.log("latitude: " + obj.latitude + '   ' + "longitude: " + obj.longitude);
            if(err){
                console.log(err);
            }
            // Sending GPS coords to client 
            socket.emit('data',obj);
        });
    },1000);
    
});

http.listen(3000,"0.0.0.0",function(){
    console.log('listening on *:3000');
});
