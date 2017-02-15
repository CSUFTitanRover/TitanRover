import serial, subprocess, pynmea2, time, string #,gps
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPSFIX = 24
GPIO.setup(GPSFIX, GPIO.IN)

class Ult_GPS():
    
    #Gets the new GPS waypoint from the Adafruit GPS device
    def newPointFromGPS(self):
        currentLatitude = 0
        currentLongitude = 0
        #divisor = 1
        for num in range(0:32)
            if GPIO.input(GPSFIX):
                nmeaSentance = self.ser.readline()
                while not nmeaSentance[0:6] == '$GPGGA':
                    nmeaSentance = self.ser.readline()
                    divisor += 1
                #might need try block in case GPS is lost during process here
                nmea_Obj = pynmea2.parse(nmeaSentance)
                currentLatitude     = currentLatitude + nmea_obj.latitude
                currentLongitude    = currentLongitude + nmea_obj.longtitude
            else:  #Gyroscope heading or Magnameter heading will go here if gps is unavailable
                currentLatitude    = 33.8352932        #demo number for testing
                currentLongitude   = -117.914503599    #demo number for testing
                #self.currentHeading     = needed from IMU
                #end Timothy Parks' math ---------
        return currentLatitude, currentLongitude

    def __init__(self):
        
        #################################################################
        #on RPi installed minicom
        #sudo apt-get install minicom
        #
        #linked the minicom to port for use by serial
        #sudo minicom -b 9600 -o -D /ttyAMA0
        #
        # Fix serial communication on UART
        #   disable BT
        #
        #   Instructions website forum at bottom easy to follow
        #   raspberrypi.stackexchange.com/questions/45570/how-do-i-make-serial-work-on-the-raspberry-pi3
        #
        #   pynmea2 must be downloaded and install
        #   TX->RX
        #   RX->TX

        self.ser=serial.Serial('/dev/ttyAMA0', 9600)
        #ser.stopbits = serial.STOPBITS_TWO
        #dev=subprocess.check_output('ls /dev/ttyAMA0', shell = True)
        #self.ser=serial.Serial(dev.strip(),baudrate=9600) #, stopbits=serial.STOPBITS_TWO)
        #################################################################

new = Ult_GPS()
print (new.newPointFromGPS())
