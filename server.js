var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);;
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');
var pg = require('pg');
var config = require('./config');
var users = {};

// Run provided query string
function runQuery(queryString, params, callback) {
    pg.connect(config.psql, function (err, client, done) {
        if (err) {
            return console.error('Failed to connect to database');
        }
        client.query(queryString, params, function (err, res) {
            done();
            
            if (err) {
                return console.error('error with query:', err);
            }
            console.log('query results:', res);
            if (callback) {
                callback(res);
            }
        });
    });
}

// Init db
// Todo provide callback and listen after init
runQuery('CREATE TABLE IF NOT EXISTS temperatures (time timestamp, temp integer);');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
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
    
    runQuery('INSERT INTO temperatures (time, temp) VALUES ($1, $2);', [temp.time, temp.temp]);

    _.keys(users).forEach(function (userId) {
        users[userId].emit('newTemp', temp);    
    });
    res.send('Temp: ' + temp.temp);
});

// Start server
console.log('Server listening at: localhost:8080');
server.listen(8080)

// Socket.io handling
io.on('connection', function (socket) {
    users[socket.id] = socket;

    runQuery('SELECT * FROM temperatures where time > $1;', [new Date(Date.now() - 1000 * 60 * 30)], function (res) {
        socket.emit('initialTemps', res.rows);
    });

    socket.on('disconnect', function () {
        delete users[socket.id];
    });
});