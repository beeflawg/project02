var socket = require("./../../models/chat-models/chat");

$(document).ready(function () {
    var socket = io.connect();
    var form = $('#myForm');
    var message = $('#txt');
    var chatArea = $('#chatArea');
    var userName = $("#userName");
    var sendUsername = $("#sendUsername")


    form.submit(function (e) {
        e.preventDefault();
        socket.emit('sending message', message.val());
        message.val('');
    });

    sendUsername.click(function () {
        socket.emit('change username', { username: userName.val() });
    });

    socket.on('new message', function (data) {
        chatArea.prepend('<div class="well-sm">' + data.username + ": " + data.message + '</div>');
    });
   
});
