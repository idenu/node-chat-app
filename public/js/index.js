var socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server!');
});

socket.on('msgOut', function (msg) {
    console.log(`${msg.from}: ${msg.text}`);
});
