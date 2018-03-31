var express = require('express');
var app = new express();
var port = 8008;

var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('./models/UserModel');
var Message = require('./models/MessageModel');

mongoose.connect('mongodb://localhost/docChat');
var db = mongoose.connection;

db.on('open', function() {
    console.log('database connected');
});

db.on('error', function (err) {
    console.log('database error: ' + err);
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = require('./routes/router.js');
router(app);

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit('new message', {
        message: "please enter your name",
        userStatus: 1,
        sender: 0
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (message) {
        let messageObj = JSON.parse(message);
        socket.emit('new message', messageObj);
        
        let newMessage = {
            message: "",
            recipient: messageObj.sender,
            sender: messageObj.recipient
        };

        if (messageObj.userStatus < 5) {
            console.log(messageObj.userStatus);
            switch (messageObj.userStatus) {
                case 1:
                    newMessage.message = "Enter your age: ";
                    newMessage.userStatus = 2;
                    socket.emit('new message', newMessage);
                    break;
                case 2:
                    newMessage.message = "Enter your symptoms: ";
                    newMessage.userStatus = 3;
                    socket.emit('new message', newMessage);
                    break;
                case 3:
                    newMessage.message = "upload media files: ";
                    newMessage.userStatus = 4;
                    socket.emit('new message', newMessage);
                    break;
                case 4:
                    newMessage.message = "assigning doctor";
                    newMessage.userStatus = 5;
                    socket.emit('new message', newMessage);
            }
            console.log(newMessage);
        } else {
            console.log('waiting for doctor messages...');
        }
    });
});

http.listen(port, function () {
    console.log('server running on http://localhost:' + port);
});