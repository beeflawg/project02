var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var server = require('http').createServer(app).listen(PORT);
var io = require('socket.io').listen(server);
var app = express();

module.exports = function socket() {
    var connections = [];
    username =  [{}];

    io.sockets.on("connection", (socket) => {
    connections.push(socket);
    console.log(" %s sockets is connected", connections.length);

    socket.username = "Anonymous"
    socket.on('change username', function (data) {
     socket.username = data.username
     username.push(socket.username);
     console.log(username)
    });

    socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on('sending message', (message, username) => {
        console.log('Message is received :', message, username);

        io.sockets.emit('new message', { message: message, username: socket.username });
    });
})};
