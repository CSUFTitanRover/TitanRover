#!/usr/bin/env python
import time
import serial


ser = serial.Serial(
	port='/dev/ttyACM0',
        baudrate=9600,
        timeout=1
        )

counter = 10

f=open('testData.txt','wa')
lineCounter = 1
while counter>=0:
	
	try:
		x=""	
		x=ser.readline()
                newString = x.split(":")
		if newString[0] == "01":
			print("We are reading the first sensor: " + str(x))
			f.write(str(lineCounter) + str(x))
			lineCounter += 1
			counter -= 1			
		elif newString[0] == "02":
			print("We are reading the second sensor: " + str(x))
			f.write(str(lineCounter) + str(x))
			lineCounter += 1
			counter -= 1
	except serial.SerialException as e:
		pass
	except TypeError as e:
		self.port.close()
		pass
	except IOError as err:
		print("Error is: " + str(err))
		continue
	except:
		print("We have found an error idiots: ")
		pass


f.close()

