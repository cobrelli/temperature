var express = require('express');
//v//ar app = express();
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);;
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');

var users = {};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/temp/', function (req, res) {
    console.log('got temp', req.body.temp);
    _.keys(users).forEach(function (userId) {
        console.log('trying to emit');
        users[userId].emit('newTemp', req.body.temp);
    }); 
});

console.log('Server listening at: localhost:8080');
server.listen(8080)

io.on('connection', function (socket) {
    users[socket.id] = socket;
    
    socket.on('disconnect', function () {
        delete users[socket.id];
    });
});