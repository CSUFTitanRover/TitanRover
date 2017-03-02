#!/usr/bin/python

#import
import RPi.GPIO as GPIO
import serial, subprocess, os, time, gps, string, math, sys
import pynmea2
'''
arguments = True

def definitions():
  if len(sys.argv) > 1:
    global lat2
    global lon2
    lat = sys.argv[1]
    lon2 = sys.argv[2]
  else:
    global arguments
    arguments = False
'''
PI = math.pi                  #3.1415926535897932384626433832795
DEG_TO_RAD = math.pi / 180    #0.017453
RAD_TO_DEG = 180 / math.pi    #57.29577795

#os.system('clear') #clear the terminal (optional)

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
 
def main():
  nmea1 = ser.readline()
  nmea2 = ser.readline()
  while not nmea1[0:6] == '$GPGGA':
    nmea1 = ser.readline()
  nmea_obj1 = pynmea2.parse(nmea1)
  lat1 = nmea_obj1.latitude
  lon1 = nmea_obj1.longitude

  if len(sys.argv) > 1:
    GPS_Heading_Degrees = GPS_Heading(lat1,float(sys.argv[1]),lon1,float(sys.argv[2]))
  else:
    while not nmea2[0:6] == '$GPGGA':
      nmea2 = ser.readline()
    nmea_obj2 = pynmea2.parse(nmea2)
    lat2 = nmea_obj2.latitude
    lon2 = nmea_obj2.longitude
    GPS_Heading_Degrees = GPS_Heading(lat1,lat2,lon1,lon2)
    
  '''
    data = ser.readline()
    if data[0:6] == '$GPGGA':
      nmea_obj = pynmea2.parse(data)
      print 'Latitude = ' + str(nmea_obj.latitude)
      print 'Longitude = ' + str(nmea_obj.longitude)
      print 'Number of Sat fix ' + str(nmea_obj.num_sats)
  '''
  
        
  print GPS_Heading_Degrees
  sys.stdout.flush()
    #time.sleep(.2)
      
def GPS_Heading(lat_1, lat_2, lon_1, lon_2):
    angle = 0.0
    lat1 = lat_1 * DEG_TO_RAD
    lat2 = lat_2 * DEG_TO_RAD
    lon1 = lon_1 * DEG_TO_RAD
    lon2 = lon_2 * DEG_TO_RAD
    
    if (math.cos(lat2) * math.sin(lon2 - lon1)) == 0:
        if lat2 > lat1:
            return 0.0
        else:
            return 180.0
    else:
        angle = math.atan2(math.cos(lat2) * math.sin(lon2 - lon1),
                math.sin(lat2) * math.cos(lat1) - math.sin(lat1) *
                math.cos(lat2) * math.cos(lon2 - lon1))
        return (angle * RAD_TO_DEG + 360) % 360


if __name__ == '__main__':
  
  try:
    main()
  except KeyboardInterrupt:
    pass

