#!/usr/bin/env python

"""
	author: Brandon Hawkinson, Joseph Porter
	Description: Will read the serial port for arduino sensors and 
		make sure the data is in correct format for data transfer 
		back to home server.
	Date: 11/21/16
"""

import time
import serial
import sys
import signal

# Will be used to exit the while loop
global run

# Ctrl+c to exit the python script
def signal_handler(signal, frame):
	global run
	run = False
	print("Shutting down!!!")
	sys.exit(0)

# Main program
def main():
	global run

	# Initialize the serial port that will be used to communicate with the ardiuno
	ser = serial.Serial(
        port='/dev/ttyACM4',
        baudrate=9600,
        timeout=1
        )

	# Write all the data to this file with the line counter
	f=open('testData.txt','a')

	# This will keep the sensor collector and this reader in sync
	lineCounter = 1

	while run:

        	try:
			# Read from the serial port
        	        x=""
        	        x=ser.readline()

			# Use ":" as the delimiter
        	        newString = x.split(":")

			# Decagon5te sensor
        	        if newString[0] == "01":
				if len(x) == 20: # Total number of chars
	        	                print("We are reading the first sensor: " + str(x))
	        	                f.write(str(lineCounter) + ":" + str(x))
	               		        lineCounter += 1
			# DHT11 sensor
                	elif newString[0] == "02":
				if len(x) == 15: # Total number of chars
                                	print("We are reading the second sensor: " + str(x))
                                	f.write(str(lineCounter) + ":" +  str(x))
                                	lineCounter += 1
			# Add additional sensors
			# Add additional sensors
			# Add additional sensors
			# Add additional sensors  
		# Exceptions
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


	# If we have exited the while loop close the file
	f.close()


if __name__ == '__main__':
	global run
	run = True
	# Will detect if ctrl+c has been pressed and exit the script
	signal.signal(signal.SIGINT, signal_handler)
	main()
