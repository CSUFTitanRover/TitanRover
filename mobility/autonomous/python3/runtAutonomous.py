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
    def __init__(self, targetLongitude, targetLatitude):
       self.longitude = targetLongitude #stores the target longitude to the waypoint
       self.latitude = targetLatitude #stores the target latitude to the waypoint
       
    #function takes in all current location data and compares it to the desired location data to determine target heading
    #Most math provided by Timothy Parks
    def calculateHeading(currentLongitude, currentLatitude, currentHeading): #currentLongitude, currentLatitude, currentHeading):
        #convert longitude and lattitude to radians
        targetLongitudeRad = targetLongitude * degToRad
        targetLatitudeRad = targetLatitude * degToRad
        currentLongitudeRad = currentLongitude * degToRad
        currentLatitude = currentLatitude * degToRad
		#currentLongitudeRad, currentLatitude = self.newPointFromGPS()         
		#--------

        if (math.cos(targetLatitudeRad)*math.sin(targetLongitudeRad - currentLongitudeRad)) == 0:
            if targetLatitudeRad > currentLatitude:
                targetHeading = 0.0 #return 0.0
            else:
                targetHeading = 180 #return 180
        else: #this math is necesary to determine the target heading. 
            angle = math.atan2(math.cos(targetLatitudeRad) * math.sin(targetLongitudeRad - currentLongitudeRad),
                math.sin(targetLatitudeRad) * math.cos(currentLatitude) - math.sin(currentLatitude) *
                math.cos(targetLatitudeRad) * math.cos(targetLongitudeRad - currentLongitudeRad))
        targetHeading = (angle * radToDeg + 360) % 360

        #Returns the degree change needed with currentHeading as a 0 degree using +- 180 degree change 
        if (360 - currentHeading) + targetHeading < 180: 		

            return ((360 - currentHeading) + targetHeading)
        else:
            return targetHeading - currentHeading

    #Gets the new GPS waypoint from the Adafruit GPS device
    def newPointFromGPS():
        if GPIO.input(GPSFIX):
            nmeaSentance = ser.readline()
            while not nmeaSentance[0:6] == '$GPGGA':
                nmeaSentance = ser.readline()
            nmea_Obj = pynmea2.parse(nmea2)
            currentLatitude = nmea_obj1.latitude
            currentLongitude = nmea_obj1.longtitude
        else:
            currentLatitude = 33.2222
            currentLongitude = 110.33434
	    #end Timothy Parks' math ---------

#this function prompts for the longitude and lattitude of a desired waypoint.
#these will be stored from first entered to last, enter your path in order
def enterWaypoint(waypoints_list = []):
    print("Please enter waypoint")
    inputLongitude = input("Longitude: ")
    inputLatitude = input("Lattitude: ")
    storeWaypoint = waypoint(inputLongitude, inputLatitude)
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
        print (waypoints_list[x].latitude)

main()
