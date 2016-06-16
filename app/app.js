import d3 from 'd3';
import io from 'socket.io-client';
import _ from 'lodash'

var socket = io.connect();
var TIMESCALE_RANGE = 1000 * 60 * 30; // 30 minutes
var temps = []

socket.on('newTemp', (temp) => {
    temps.push(temp);
    render();
});

socket.on('initialTemps', (initialTemps) => {
    initialTemps.forEach((temp) => temps.push(temp));
    render();
});

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date(Date.now() - TIMESCALE_RANGE), new Date()])
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
setInterval(() => {
    var removed = _.remove(temps, (t) => new Date(t.time).getTime() < new Date(Date.now() - TIMESCALE_RANGE).getTime());

    // Update x domain
    x.domain([new Date(Date.now() - TIMESCALE_RANGE), new Date()]);
    // Update x axis
    svg.selectAll('.x.axis')
        .call(xAxis);
    // Run selections
    render();
}, 1000);

var render = () => {
    var tempDots = svg.selectAll('.dot').data(temps, (d) => d.time);

    svg.selectAll('.dot')
        .attr('cx', (d) => x(new Date(d.time)))
        .attr('cy', (d) => y(d.temp));

    tempDots.enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 1)
        .attr('cx', (d) => x(new Date(d.time)))
        .attr('cy', (d) => y(d.temp));

    tempDots.exit().remove();
}

render();