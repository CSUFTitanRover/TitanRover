#!/usr/bin/python

import math

PI = math.pi             #3.1415926535897932384626433832795
DEG_TO_RAD = math.pi / 180    #0.017453
RAD_TO_DEG = 180 / math.pi    #57.29577795


def GPS_Heading(lat1, lat2, lon1, lon2):
    heading = 0.0
    lat1 = lat1 * DEG_TO_RAD
    lat2 = lat2 * DEG_TO_RAD
    lon1 = lon1 * DEG_TO_RAD
    lon2 = lon2 * DEG_TO_RAD
    
    if (math.cos(lat2) * math.sin(lon2 - lon1)) == 0:
        if lat2 > lat1:
            return 0.0
        else:
            return 180
    else:
        angle = math.atan2(math.cos(lat2) * math.sin(lon2 - lon1),
                math.sin(lat2) * math.cos(lat1) - math.sin(lat1) *
                math.cos(lat2) * math.cos(lon2 - lon1))
        return (angle * RAD_TO_DEG + 360) % 360


reach_file = open("file.llh", "r", -1)

nema_data = ['a']

while not nema_data[0].isdigit():
    data_line = reach_file.readline()
    nema_data = data_line.split(" ")

gps_data = [float(nema_data[4]), float(nema_data[5])]

while data_line:
    data_line = reach_file.readline()
    nema_data = data_line.split(" ")
    if not nema_data[0].isdigit():
        break
    data_line2 = data_line

nema_data = data_line2.split(" ")
gps_data2 = [float(nema_data[4]), float(nema_data[5])]

#Enable this section including for Loop to check data#########
#print data_line
#n = 0
#for i in gps_data2:
#    print str(n) + ' ' + str(i)  # 
#    n+=1
##############################################################

reach_file.close()

GPS_Heading_Degrees = GPS_Heading(gps_data[0], gps_data2[0],
                                  gps_data[1], gps_data2[1])
        
print GPS_Heading_Degrees
