var d3 = require('d3');
var io = require('socket.io-client');
var socket = io.connect();

var temps = []

socket.on('newTemp', function (temp) {
    temps.push(temp);
    render();
});

socket.on('initialTemps', function (initialTemps) {
    initialTemps.forEach(function (temp) {
        temps.push(temp);
    });
    render();
});

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date(Date.now() - 1000 * 60 * 30), new Date()])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-40, 40])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

// Update x axis every second
setInterval(function () {
    // Update x domain
    x.domain([new Date(Date.now() - 1000 * 60 * 30), new Date()])
    // Update x axis
    svg.selectAll('.x.axis')
        .call(xAxis);
    // Update temp dots
    svg.selectAll('.dot')
        .attr('cx', function (d) { return x(new Date(d.time)); })
        .attr('cy', function (d) { return y(d.temp); });
}, 1000);

function render() {
    var enteringTemps = svg.selectAll('.dot')
        .data(temps);

    enteringTemps.enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 1)
        .attr('cx', function (d) { return x(new Date(d.time)); })
        .attr('cy', function (d) { return y(d.temp); });

    enteringTemps.exit().remove();
}

render();