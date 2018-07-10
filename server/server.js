const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected!');

    // socket.emit from admin text: "Welcome to the chap app"
    socket.emit('newMsg', {
        from: 'ADMIN',
        text: 'Welcome to the chap app'
    });

    // socket.broadcast.emit text: "New user joined"
    socket.broadcast.emit('newMsg', {
        from: 'ADMIN',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMsg', (msg) => {
        console.log(msg.from);
        io.emit('newMsg', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMsg', {
        //     from: msg.from,
        //     text: msg.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected!');
    });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
