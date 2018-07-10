const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected!');

    socket.emit('newMsg', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMsg', generateMessage('Admin', 'New user joined'));

    socket.on('createMsg', (msg) => {
        io.emit('newMsg', generateMessage(msg.from, msg.text));
    });
 
    socket.on('disconnect', () => {
        console.log('User was disconnected!');
    });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
