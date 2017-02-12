import os
from math import radians, degrees, cos, sin, asin, sqrt, atan2, pi
import serial, subprocess, os, time, gps, string, sys, pynmea2
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPSFIX = 18
GPIO.setup(GPSFIX, GPIO.IN)

#implementing Timothy Parks' math to calculate heading
#pi = math.pi                #Est val of 3.1415926535897932384626433832795
degToRad = pi / 180    #Est val of 0.017453
radToDeg = 180 / pi    #Est val of 57.29577795
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
        self.targetLongitude = targetLongitude  #stores the target longitude to the waypoint
        self.targetLatitude = targetLatitude    #stores the target latitude to the waypoint

        #initialize Rover storage
        self.currentLongitudeRad    = 0.0
        self.currentLatitude        = 0.0
        self.currentHeading         = 0.0
        self.targetDistance         = 0.0

        self.newPointFromGPS()                  #Update Rover waypoint
       
    #function takes in all current location data and compares it to the desired location data to determine target heading
    #Most math provided by Timothy Parks
    def calculateHeading(self, targetLongitude, targetLatitude, currentLongitude, currentLatitude): #currentLongitude, currentLatitude, currentHeading):
        #convert longitude and lattitude to radians
        targetLongitudeRad, targetLatitudeRad, currentLongitudeRad, currentLatitudeRad = map(radians, [targetLongitude, targetLatitude, currentLongitude, currentLatitude])
	#--------

        ##  Distance using Haversine Formula
        distanceLongitudeRad = targetLongitudeRad - currentLongitudeRad
        distanceLatitudeRad = targetLatitudeRad - targetLatitudeRad
        a = sin(distanceLatitudeRad/2)**2 + cos(targetLatitudeRad) * cos(targetLatitudeRad) * sin(distanceLongitudeRad/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371 #Radius of earth in km
        self.targetDistance = c * r

        ##  Bearing angle between to points
        if (cos(targetLatitudeRad)*sin(degToRad*(targetLongitude - currentLongitude))) == 0:
            if targetLatitudeRad > currentLatitudeRad:
                return 0.0
            else:
                return 180
        else: #this math is necesary to determine the target heading. 
            angle = atan2((cos(currentLatitudeRad)*sin(targetLatitudeRad)) - (sin(currentLatitudeRad)*cos(targetLatitudeRad)*cos(targetLongitudeRad-currentLongitudeRad)), sin(targetLongitudeRad - currentLongitudeRad)*cos(targetLatitudeRad))
        return (angle * radToDeg + 360) % 360


    #function returns the degree correction
    #positive means go right and negative go left
    def calculateHeadingCorrection(self):
        #Returns the degree change needed with currentHeading as a 0 degree using +- 180 degree change 
        self.newPointFromGPS()
        targetHeading = self.calculateHeading(self.targetLongitude, self.targetLatitude, self.currentLongitude,
                                              self.currentLatitude)
        print self.currentHeading
        print targetHeading
        if (self.currentHeading + targetHeading <= 180):
            return targetHeading
        elif(targetHeading == 360 || -360):
            return 0.0
        else:
            return ((self.currentHeading + targetHeading)-360)
        
    #Gets the new GPS waypoint from the Adafruit GPS device
    def newPointFromGPS(self):
        if GPIO.input(GPSFIX):
            nmeaSentance1 = ser.readline()
            nmeaSentance2 = ser.readline()
            while not nmeaSentance1[0:6] == '$GPGGA':
                nmeaSentance = ser.readline()
            while not nmeaSentance2[0:6] == '$GPGGA':
                nmeaSentance = ser.readline()
            #might need try block in case GPS is lost during process here
            nmea_Obj = pynmea2.parse(nmea2)
            self.currentHeading = self.calculateHeading(nmea_obj2.longtitude, nmea_obj2.latitude,
                                                        nmea_obj1.longtitude, nmea_obj1.latitude)
            self.currentLatitude     = nmea_obj2.latitude
            self.currentLongitude    = nmea_obj2.longtitude
        else:  #Gyroscope heading or Magnameter heading will go here if gps is unavailable
            self.currentLatitude    = 33.8352932        #demo number for testing
            self.currentLongitude   = -117.914503599    #demo number for testing
            #self.currentHeading     = needed from IMU
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
    waypointsReceived = False #logic to determine whether or not our path was recieved
    waypoints_list = []

    if len(sys.argv) == 3:
        #storeWaypoint = waypoint(sys.argv[1], sys.argv[2])
        waypoints_list.append(waypoint(float(sys.argv[1]), float(sys.argv[2])))
        waypointsReceived = True

    while not waypointsReceived: #create waypoints continously until finished. 
        waypoints_list = enterWaypoint(waypoints_list)
        userInput = raw_input("Would you like to store another waypoint?(Y/N): ")
        if userInput.upper() == 'N':
            waypointsReceived = True
    
    for x in range(len(waypoints_list)):
        #Using this same logic we can call calculateHeading for each waypoint, then start the navigation to turn to the heading
        #Once we've turned, start the navigation towards the wayppoint. Check if there. Then loop until all waypoints are finished
        #Once finished spit back to the user that the loop has been completed OR call tennisBall recognition function/file/etc
        waypoints_list[x].newPointFromGPS()
        print "Current Longitude "  + str(waypoints_list[x].currentLongitude)
        print "Current Latitude "   + str(waypoints_list[x].currentLatitude)
        print "Target Longitude "   + str(waypoints_list[x].targetLongitude)
        print "Target Latitude "    + str(waypoints_list[x].targetLatitude)
        print "Turn By(Deg): "      + str(waypoints_list[x].calculateHeadingCorrection())   + " Degrees"
        print "Distance "           + str(waypoints_list[x].targetDistance)                 + " km" 

main()
