Web application part for arduino temperature monitor

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
  
  Todo (Arduino & raspbi):
  - Add more sensors?