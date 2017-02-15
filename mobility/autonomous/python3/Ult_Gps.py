import serial, subprocess, gps, pynmea, time, string

GPIO.setmode(GPIO.BOARD)
GPSFIX = 18
GPIO.setup(GPSFIX, GPIO.IN)

class Ult_GPS():
    
    #Gets the new GPS waypoint from the Adafruit GPS device
    def newPointFromGPS(self):
        if GPIO.input(GPSFIX):
            nmeaSentance1 = self.ser.readline()
            nmeaSentance2 = self.ser.readline()
            while not nmeaSentance1[0:6] == '$GPGGA':
                nmeaSentance = self.ser.readline()
            while not nmeaSentance2[0:6] == '$GPGGA':
                nmeaSentance = self.ser.readline()
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
        #pynmea2 must be downloaded and install
        #TX->RX
        #RX->TX

        self.ser=serial.Serial('/dev/ttyAMA0', 9600)
        #ser.stopbits = serial.STOPBITS_TWO
        #dev=subprocess.check_output('ls /dev/ttyAMA0', shell = True)
        #ser=serial.Serial(dev.strip(),baudrate=9600) #, stopbits=serial.STOPBITS_TWO)
        #################################################################

