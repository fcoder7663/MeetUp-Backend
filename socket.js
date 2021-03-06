const express = require('express');
var app = express();
const path =  require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 5500;

app.use(express.static(path.join(__dirname)));

/*
console.log(__dirname);
const fs = require('fs');
const testFolder = path.join(__dirname, '');
fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});
*/

app.get('/', (req,res) => {
    res.send("hello")
    res.end();
})

var clients = 0;
var users = [];

io.on('connection', function(socket) {

    clients++;
    
    io.emit("online", clients + " users are online .");

    // socket.broadcast.emit('newclientconnect', { description : 'Hey , Welcome there from my side.'});
    // socket.broadcast.emit('newclientconnect', { description : clients + ' clients connected.'});

    socket.on('newuser', (data) => {
        users.push({'userid' : socket.id, 'username' : data.username});
        io.emit('alluser', users);
        console.log(users);
    });

    console.log('A user Connected.');

    socket.broadcast.emit('message' , { message : socket.id + " user Connected."});

    socket.on('another_message', (data) => {
        console.log(data.message);
        socket.broadcast.emit('message',data);
    });

    /*setTimeout(function() {
        socket.send("Hello my self vishal singh ,"+
         "have a nice day from my side.");
    },4000);*/
    
    socket.on('disconnect', function() {
        clients--;  
        io.emit("online", clients + " users are online .");
        // users.pop();
        //socket.broadcast.emit('newclientconnect', { description : clients + ' clients connected.'});
        //io.sockets.emit('broadcast',{ description : clients + ' connected.'});
        // io.emit('message' , { message : socket.id + " user Disconnected."});
    });

});

http.listen(port, function() {
    console.log('Server is listening at port ' + port);
});