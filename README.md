Web application part for arduino temperature monitor

- arduino/thermometer.c contains arduino parts of the code
- raspbi/readSerial.py contains raspberrypi parts of code for reading data from serial 
  and pushing data to server
  
  Todo:
  - Implement build with minification and vendor split
  - Improve temperature chart:
    - Remove old tasks
    - Stop tasks from going outside chart
    - Rework temp range (maybe dynamic)
  - Add client framework (React?)
  - Add additional information: all-time high, current temp etc?