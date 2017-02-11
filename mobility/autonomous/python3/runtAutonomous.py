import os
import math
import serial, subprocess, os, time, gps, string, sys, pynmea2
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPSFIX = 18
GPIO.setup(GPSFIX, GPIO.IN)

#implementing Timothy Parks' math to calculate heading
pi = math.pi #3.1415926535897932384626433832795
degToRad = math.pi / 180 #0.017453
radToDeg = 180 / math.pi #57.29577795
#----------------- end

#################################################################
#on RPi installed minicom
#sudo apt-get install minicom
#
#linked the minicom to port for use by serial
#sudo minicom -b 9600 -o -D /ttyAMA0
#pynmea2 must be downloaded and install
#TX->RX
#RX->TX

ser=serial.Serial('/dev/ttyAMA0', 9600)
#ser.stopbits = serial.STOPBITS_TWO
#dev=subprocess.check_output('ls /dev/ttyAMA0', shell = True)
#ser=serial.Serial(dev.strip(),baudrate=9600) #, stopbits=serial.STOPBITS_TWO)
#################################################################


#TODO Add distance formula to calculate distance between two waypoints
#TODO Add IMU and Adafruit GPS implimentation for testing
#-THEN Figuring out the turning algorithm
#--THEN Begin navigation towards waypoint function
#---THEN Incorporate object recognition if needed 

class waypoint:
    #TODO Add heading argument
    ###########################################################################
    #all stored Longitude, Latitude and Headings need to be in DECIMAL DEGREES
    ###########################################################################
    def __init__(self, targetLongitude, targetLattitude):
       self.longitude = targetLongitude #stores the target longitude to the waypoint
       self.lattitude = targetLattitude #stores the target lattitude to the waypoint
    
    #function takes in all current location data and compares it to the desired location data to determine target heading
    #Most math provided by Timothy Parks
    def calculateHeading(targetLongitude, targetLattitude, currentHeading): #currentLongitude, currentLattitude, currentHeading):
        #convert longitude and lattitude to radians
        targetLongitudeRad = targetLongitude * degToRad
        targetLattitudeRad = targetLattitude * degToRad
        #currentLongitudeRad = currentLongitude * degToRad
        #currentLattitudeRad = currentLattitude * degToRad
		currentLongitudeRad, currentLattitudeRad = self.newPointFromGPS()         
		#--------

        if (math.cos(targetLattitudeRad)*math.sin(targetLongitudeRad - currentLongitudeRad)) == 0:
            if targetLattitudeRad > currentLattitudeRad:
                targetHeading = 0.0 #return 0.0
            else:
                targetHeading = 180 #return 180
        else:
            angle = math.atan2(math.cos(targetLattitudeRad) * math.sin(targetLongitudeRad - currentLongitudeRad),
                math.sin(targetLattitudeRad) * math.cos(currentLattitudeRad) - math.sin(currentLattitudeRad) *
                math.cos(targetLattitudeRad) * math.cos(targetLongitudeRad - currentLongitudeRad))
        targetHeading = (angle * radToDeg + 360) % 360
	
		#Returns the degree change needed with currentHeading as a 0 degree using +- 180 degree change 
		if (360 - currentHeading) + targetHeading < 180:
	    	return (360 - currentHeading) + targetHeading 
		else:
	    	return targetHeading - currentHeading

        #end Timothy Parks' math ---------
        #TODO Compare to current heading, calculate the difference of the two. The function will spit out the change in heading we need to make
    
    #New or updating the stored waypoint in the object
    def newPointFromGPS()
		if GPIO.input(GPSFIX)
			nmeaSentance = ser.readline()
			while not nmeaSentance[0:6] == '$GPGGA':
	    		nmeaSentance = ser.readline()
			nmea_Obj = pynmea2.parse(nmea2)
			return nmea_obj1.latitude, nmea_obj1.longitude
		else:
			return 33.2222, 110.33434




#this function prompts for the longitude and lattitude of a desired waypoint.
#these will be stored from first entered to last, enter your path in order
def enterWaypoint(waypoints_list = []):
    print("Please enter waypoint")
    inputLongitude = input("Longitude: ")
    inputLattitude = input("Lattitude: ")
    storeWaypoint = waypoint(inputLongitude, inputLattitude)
    waypoints_list.append(storeWaypoint) 
    return waypoints_list #return the appended list

def main():
    waypointsRecieved = False #logic to determine whether or not our path was recieved

    waypoints_list = []

    while(waypointsRecieved==False): #create waypoints continously until finished. 
        waypoints_list = enterWaypoint(waypoints_list)
        userInput = input("Would you like to store another waypoint?(Y/N): ")
        if userInput == "N":
            waypointsRecieved = True
    
    for x in range(len(waypoints_list)):
        #Using this same logic we can call calculateHeading for each waypoint, then start the navigation to turn to the heading
        #Once we've turned, start the navigation towards the wayppoint. Check if there. Then loop until all waypoints are finished
        #Once finished spit back to the user that the loop has been completed OR call tennisBall recognition function/file/etc
        print (waypoints_list[x].longitude)
        print (waypoints_list[x].lattitude)

main()
