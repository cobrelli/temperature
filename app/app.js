var d3 = require('d3');
var io = require('socket.io-client');
var socket = io.connect('http://0.0.0.0:8080');

socket.on('newTemp', function (temp) {
    console.log('got new temp', temp);
});