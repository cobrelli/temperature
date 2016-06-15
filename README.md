Web application part for arduino temperature monitor

Desc:
Arduino collects (currently only) temperature data and sends it via serial to 
raspberry pi which in turn sends it to server. Data is displayed on client using d3js.

- arduino/thermometer.c contains arduino parts of the code
- raspbi/readSerial.py contains raspberrypi parts of code for reading data from serial 
  and pushing data to server
  
  Todo (web):
  - Implement build with minification and vendor split
  - Improve temperature chart:
    - Remove old tasks
    - Stop tasks from going outside chart
    - Rework temp range (maybe dynamic)
  - Add client framework (React?)
  - Split code to smaller components: routes, socket etc.
  - Add additional information: all-time high, current temp etc?
  - Add tests?
  
  Todo (Arduino & raspbi):
  - Add more sensors?