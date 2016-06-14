#!/usr/bin/python

import requests
import serial

ser = serial.Serial('/dev/ttyACM0', 9600)

while True :
	line = ser.readline()
	print(line)
	requests.post('http://temp.cobu.xyz/temp', data={'temp': line})