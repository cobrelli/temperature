var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);;
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');
var pg = require('pg');
var Promise = require('bluebird');

// Promisify pg
Promise.promisifyAll(pg, {
    filter: function (methodName) {
        return methodName === "connect"
    },
    multiArgs: true
});
Promise.promisifyAll(pg);

var config = require('./config');
var users = {};

// DB query definition
function runQuery(queryString, params, callback) {
    return pg.connectAsync(config.psql).spread(function (client, release) {
        return client.queryAsync(queryString, params);
    }).catch(function (error) {
        console.log('Error occurred:', error);
    });
}

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.post('/temp/', function (req, res) {
    console.log('got new temp', req.body.temp);
    if (req.body.token !== config.token) {
        res.send('Incorrect access token');
        return;
    }

    var temp = {
        time: new Date(),
        temp: parseInt(req.body.temp)
    }

    runQuery('INSERT INTO temperatures (time, temp) VALUES ($1, $2);', [temp.time, temp.temp]).then(function () {
        _.keys(users).forEach(function (userId) {
            users[userId].emit('newTemp', temp);
        });
        res.send('Temp: ' + temp.temp);
    });
});

// Socket.io handling
io.on('connection', function (socket) {
    users[socket.id] = socket;

    runQuery('SELECT * FROM temperatures where time > $1;', [new Date(Date.now() - 1000 * 60 * 30)]).then(function (res) {
        socket.emit('initialTemps', res.rows);
    });

    socket.on('disconnect', function () {
        delete users[socket.id];
    });
});

// Init db
runQuery('CREATE TABLE IF NOT EXISTS temperatures (time timestamp, temp integer);').then(function () {
    // Start server
    console.log('Server listening at: localhost:8080');
    server.listen(8080)
});