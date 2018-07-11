require('./config/config');
require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const router = express.Router();

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/callback'
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);


passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// var env = process.env.NODE_ENV || 'development';
// console.log(env);

// if (env === 'production') {
//     // 
// }

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected!');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room name are required.');
        }
        
        socket.join(params.room);
        // socket.leave(params.room);

        // io.emit -> io.to()
        // socket.broadcast.emit
        // socket.emit

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longtitude));
    });
 
    socket.on('disconnect', () => {
        console.log('User was disconnected!');
    });
});

const env = {
    AUTH0_CLIENT_ID: 'ZjJLHbB9Gjq2ysca_2gMcbUJleIKRZol',
    AUTH0_DOMAIN: 'wild-truth-7822.eu.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
  };

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
  });
  
  // Perform the login
  router.get(
    '/login',
    passport.authenticate('auth0', {
      clientID: env.AUTH0_CLIENT_ID,
      domain: env.AUTH0_DOMAIN,
      redirectUri: env.AUTH0_CALLBACK_URL,
      audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
      responseType: 'code',
      scope: 'openid'
    }),
    function(req, res) {
      res.redirect('/');
    }
  );
  
  // Perform session logout and redirect to homepage
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  // Perform the final stage of authentication and redirect to '/user'
  router.get(
    '/callback',
    passport.authenticate('auth0', {
      failureRedirect: '/'
    }),
    function(req, res) {
      res.redirect(req.session.returnTo || '/user');
    }
  );

server.listen(port, () => console.log(`Server is up on ${port}`));
