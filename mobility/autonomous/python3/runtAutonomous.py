import os
import math

#implementing Timothy Parks' math to calculate heading
pi = math.pi #3.1415926535897932384626433832795
degToRad = math.pi / 180 #0.017453
radToDeg = 180 / math.pi #57.29577795
#----------------- end

class waypoint:
    #TODO Add heading argument
    def __init__(self, targetLongitude, targetLattitude):
       self.longitude = targetLongitude #stores the target longitude to the waypoint
       self.lattitude = targetLattitude #stores the target lattitude to the waypoint
    
    #function takes in all current location data and compares it to the desired location data to determine target heading
    #Most math provided by Timothy Parks
    def calculateHeading(currentLongitude, currentLattitude, currentHeading):
        #convert longitude and lattitude to radians
        targetLongitudeRad = targetLongitude * degToRad
        targetLattitudeRad = targetLattitude * degToRad
        currentLongitudeRad = currentLongitude * degToRad
        currentLattitudeRad = currentLattitude * degToRad
        #--------

        if (math.cos(targetLattitudeRad)*math.sin(targetLongitudeRad - currentLongitudeRad)) == 0:
            if targetLattitudeRad > currentLattitudeRad:
                return 0.0
            else:
                return 180
        else:
            angle = math.atan2(math.cos(targetLattitudeRad) * math.sin(targetLongitudeRad - currentLongitudeRad),
                math.sin(targetLattitudeRad) * math.cos(currentLattitudeRad) - math.sin(currentLattitudeRad) *
                math.cos(targetLattitudeRad) * math.cos(targetLongitudeRad - currentLongitudeRad))
        targetHeading = (angle * radToDeg + 360) % 360
        #end Timothy Parks' math ---------

#this function prompts for the longitude and lattitude of a desired waypoint.
#these will be stored from first entered to last, enter your path in order
def enterWaypoint(waypoints_list = []):
    print("Please enter waypoint")
    inputLongitude = input("Longitude: ")
    inputLattitude = input("Lattitude: ")
    #TODO: Get heading and add argument to input
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
        print (waypoints_list[x].longitude)
        print (waypoints_list[x].lattitude)

main()
