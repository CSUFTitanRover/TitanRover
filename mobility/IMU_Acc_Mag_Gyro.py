####################################################################################
#
#       Each axis operates in a 360 Degree clockwise increase
#
#       Program dependancies the IMU must circuit must be placed either facing up
#       or facing down for accurate initialization process.  Depending on up/down
#       several lines of codes need to be commented out or used.  These sections
#       of code are titled:
#                       ##########Direction Requirement###########
#       for the purposes of this project which used the Adafruit 10-DOF the unit
#       is considered upside down if the IC's on the IMU are facing the direction
#       of the earth.  Right side up is IC's facing the sky.
#
####################################################################################


import sys

import smbus
import time
import math
from LSM303_U import *
from L3GD20_GYRO import *
import datetime
bus = smbus.SMBus(1)

RAD_TO_DEG = 57.29578
M_PI = 3.14159265358979323846
G_GAIN = 0.070  # [deg/s/LSB]  If you change the dps for gyro, you need to update this value accordingly
AA =  0.40      # Complementary filter constant

class IMU:

        def kalmanFilterY (self, accAngle, gyroRate, DT):
                y=0.0
                S=0.0

                '''
                global self.KFangleY
                global self.Q_angle
                global self.Q_gyro
                global self.y_bias
                global self.YP_00
                global self.YP_01
                global self.YP_10
                global self.YP_11
                '''

                self.KFangleY = self.KFangleY + DT * (gyroRate - self.y_bias)

                self.YP_00 = self.YP_00 + ( - DT * (self.YP_10 + self.YP_01) + self.Q_angle * DT )
                self.YP_01 = self.YP_01 + ( - DT * self.YP_11 )
                self.YP_10 = self.YP_10 + ( - DT * self.YP_11 )
                self.YP_11 = self.YP_11 + ( + self.Q_gyro * DT )

                y = accAngle - self.KFangleY
                S = self.YP_00 + self.R_angle
                K_0 = self.YP_00 / S
                K_1 = self.YP_10 / S

                self.KFangleY = self.KFangleY + ( K_0 * y )
                self.y_bias = self.y_bias + ( K_1 * y )

                self.YP_00 = self.YP_00 - ( K_0 * self.YP_00 )
                self.YP_01 = self.YP_01 - ( K_0 * self.YP_01 )
                self.YP_10 = self.YP_10 - ( K_1 * self.YP_00 )
                self.YP_11 = self.YP_11 - ( K_1 * self.YP_01 )

                return self.KFangleY

        def kalmanFilterX (self, accAngle, gyroRate, DT):
                x=0.0
                S=0.0
                '''
                global self.KFangleX
                global self.Q_angle
                global self.Q_gyro
                global self.x_bias
                global self.XP_00
                global self.XP_01
                global self.XP_10
                global self.XP_11
                '''

                self.KFangleX = self.KFangleX + DT * (gyroRate - self.x_bias)

                self.XP_00 = self.XP_00 + ( - DT * (self.XP_10 + self.XP_01) + self.Q_angle * DT )
                self.XP_01 = self.XP_01 + ( - DT * self.XP_11 )
                self.XP_10 = self.XP_10 + ( - DT * self.XP_11 )
                self.XP_11 = self.XP_11 + ( + self.Q_gyro * DT )

                x = accAngle - self.KFangleX
                S = self.XP_00 + self.R_angle
                self.K_0 = self.XP_00 / S
                self.K_1 = self.XP_10 / S

                self.KFangleX = self.KFangleX + ( self.K_0 * x )
                self.x_bias = self.x_bias + ( self.K_1 * x )

                self.XP_00 = self.XP_00 - ( self.K_0 * self.XP_00 )
                self.XP_01 = self.XP_01 - ( self.K_0 * self.XP_01 )
                self.XP_10 = self.XP_10 - ( self.K_1 * self.XP_00 )
                self.XP_11 = self.XP_11 - ( self.K_1 * self.XP_01 )

                return self.KFangleX

        def writeACC(self, register,value):
                bus.write_byte_data(LSM303_ADDRESS_ACCEL , register, value)
                return -1

        def writeMAG(self, register,value):
                bus.write_byte_data(LSM303_ADDRESS_MAG, register, value)
                return -1

        def writeGRY(self, register,value):
                bus.write_byte_data(L3GD20_ADDRESS_GYRO, register, value)
                return -1

        def readACCx(self):
                acc_l = bus.read_byte_data(LSM303_ADDRESS_ACCEL, LSM303_ACCEL_OUT_X_L_A)
                acc_h = bus.read_byte_data(LSM303_ADDRESS_ACCEL, LSM303_ACCEL_OUT_X_H_A)
                acc_combined = (acc_l | acc_h <<8)

                return acc_combined  if acc_combined < 32768 else acc_combined - 65536

        def readACCy(self):
                acc_l = bus.read_byte_data(LSM303_ADDRESS_ACCEL, LSM303_ACCEL_OUT_Y_L_A)
                acc_h = bus.read_byte_data(LSM303_ADDRESS_ACCEL, LSM303_ACCEL_OUT_Y_H_A)
                acc_combined = (acc_l | acc_h <<8)

                return acc_combined  if acc_combined < 32768 else acc_combined - 65536

        def readACCz(self):
                acc_l = bus.read_byte_data(LSM303_ADDRESS_ACCEL, LSM303_ACCEL_OUT_Z_L_A)
                acc_h = bus.read_byte_data(LSM303_ADDRESS_ACCEL, LSM303_ACCEL_OUT_Z_H_A)
                acc_combined = (acc_l | acc_h <<8)

                return acc_combined  if acc_combined < 32768 else acc_combined - 65536

        def readMAGx(self):
                mag_l = bus.read_byte_data(LSM303_ADDRESS_MAG, LSM303_MAG_OUT_X_L_M)
                mag_h = bus.read_byte_data(LSM303_ADDRESS_MAG, LSM303_MAG_OUT_X_H_M)
                mag_combined = (mag_l | mag_h <<8)

                return mag_combined  if mag_combined < 32768 else mag_combined - 65536

        def readMAGy(self):
                mag_l = bus.read_byte_data(LSM303_ADDRESS_MAG, LSM303_MAG_OUT_Y_L_M)
                mag_h = bus.read_byte_data(LSM303_ADDRESS_MAG, LSM303_MAG_OUT_Y_H_M)
                mag_combined = (mag_l | mag_h <<8)

                return mag_combined  if mag_combined < 32768 else mag_combined - 65536

        def readMAGz(self):
                mag_l = bus.read_byte_data(LSM303_ADDRESS_MAG, LSM303_MAG_OUT_Z_L_M)
                mag_h = bus.read_byte_data(LSM303_ADDRESS_MAG, LSM303_MAG_OUT_Z_H_M)
                mag_combined = (mag_l | mag_h <<8)

                return mag_combined  if mag_combined < 32768 else mag_combined - 65536

        def readGYRx(self):
                gyr_l = bus.read_byte_data(L3GD20_ADDRESS_GYRO, L3GD20_OUT_X_L)
                gyr_h = bus.read_byte_data(L3GD20_ADDRESS_GYRO, L3GD20_OUT_X_H)
                gyr_combined = (gyr_l | gyr_h <<8)

                return gyr_combined  if gyr_combined < 32768 else gyr_combined - 65536

        def readGYRy(self):
                gyr_l = bus.read_byte_data(L3GD20_ADDRESS_GYRO, L3GD20_OUT_Y_L)
                gyr_h = bus.read_byte_data(L3GD20_ADDRESS_GYRO, L3GD20_OUT_Y_H)
                gyr_combined = (gyr_l | gyr_h <<8)

                return gyr_combined  if gyr_combined < 32768 else gyr_combined - 65536

        def readGYRz(self):
                gyr_l = bus.read_byte_data(L3GD20_ADDRESS_GYRO, L3GD20_OUT_Z_L)
                gyr_h = bus.read_byte_data(L3GD20_ADDRESS_GYRO, L3GD20_OUT_Z_H)
                gyr_combined = (gyr_l | gyr_h <<8)

                return gyr_combined  if gyr_combined < 32768 else gyr_combined - 65536

        def __init__(self):
                #Kalman filter variables
                self.Q_angle = 0.02
                self.Q_gyro = 0.0015
                self.R_angle = 0.005
                self.x_bias = self.y_bias = 0.0
                self.XP_00 = self.XP_01 = self.XP_10 = self.XP_11 = 0.0
                self.YP_00 = self.YP_01 = self.YP_10 = self.YP_11 = 0.0
                self.KFangleX = self.KFangleY = 0.0
                self.gyroXangle = self.gyroYangle = self.gyroZangle = 0.0
                self.CFangleX = self.CFangleY = 0.0
                self.kalmanX = self.kalmanY = 0.0

                #Gyro Timing Control
                self.a = datetime.datetime.now()

                #initialise the accelerometer
                self.writeACC(LSM303_ACCEL_CTRL_REG1_A, 0b01010111) #z,y,x axis enabled, continuos update,  100Hz data rate
                self.writeACC(LSM303_ACCEL_CTRL_REG2_A, 0b00100000) #
                self.writeACC(LSM303_ACCEL_CTRL_REG4_A, 0b00100000) #+/- 16G full scale

                #initialise the magnetometer
                self.writeMAG(LSM303_CRA_REG_M, 0b10011000)#0b11110000) #Temp enable, M data rate = 50Hz
                self.writeMAG(LSM303_CRB_REG_M, 0b11100000) #+/-8.1gauss
                self.writeMAG(LSM303_MR_REG_M, 0b00000000) #Continuous-conversion mode

                #initialise the gyroscope
                self.writeGRY(L3GD20_CTRL_REG1, 0b00001111) #Normal power mode, all axes enabled
                self.writeGRY(L3GD20_CTRL_REG4, 0b00110000) #Continuos update, 2000 dps full scale

        def getAllReadings(self):
                #while True:                    #Continous run Disabled to allow Node.js control

                for num in range(1,1200):	        #Currently this loop runs for 20 reads providing greater accuracy

                        #Read the accelerometer,gyroscope and magnetometer values

                        self.ACCx = self.readACCx()
                        self.ACCy = self.readACCy()
                        self.ACCz = self.readACCz()
                        self.GYRx = self.readGYRx()
                        self.GYRy = self.readGYRy()
                        self.GYRz = self.readGYRz()
                        self.MAGx = self.readMAGx()
                        self.MAGy = self.readMAGy()
                        self.MAGz = self.readMAGz()

                        ##Calculate loop Period(LP). How long between Gyro Reads
                        b = datetime.datetime.now() - self.a
                        self.a = datetime.datetime.now()
                        LP = b.microseconds/(1000000*1.0)

                        #print "Loop Time | %5.2f|" % ( LP ),   #Error checking stop

                        #Convert Gyro raw to degrees per second
                        self.rate_gyr_x =  self.GYRx * G_GAIN
                        self.rate_gyr_y =  self.GYRy * G_GAIN
                        self.rate_gyr_z =  self.GYRz * G_GAIN

                        #Calculate the angles from the gyro.
                        self.gyroXangle += self.rate_gyr_x * LP
                        self.gyroYangle += self.rate_gyr_y * LP
                        self.gyroZangle += self.rate_gyr_z * LP

                        ##Convert Accelerometer values to degrees
                        self.AccXangle =  (math.atan2(self.ACCy,self.ACCz)+M_PI)*RAD_TO_DEG
                        self.AccYangle =  (math.atan2(self.ACCz,self.ACCx)+M_PI)*RAD_TO_DEG

                        ####################################################################
                        ##########Direction Requirement####Correct rotation value###########
                        ####################################################################

                        #Change the rotation value of the accelerometer to -/+ 180 and
                        #move the Y axis '0' point to up.
                        #
                        #Two different pieces of code are used depending on how your IMU is mounted.
                        #If IMU is up the correct way, IC's facing the sky, Use these lines
                        
                        self.AccXangle -= 180.0
                        if self.AccYangle > 90:
                                self.AccYangle -= 270.0
                        else:
                                self.AccYangle += 90.0

                        #
                        #
                        #If IMU is upside down, IC's facing the Earth, using these lines
                        #if AccXangle >180:
                        #        AccXangle -= 360.0
                        #AccYangle-=90
                        #if (AccYangle >180):
                        #        AccYangle -= 360.0
                        ############################ END ##################################

                        #Complementary filter used to combine the accelerometer and gyro values.
                        self.CFangleX = AA * (self.CFangleX + self.rate_gyr_x * LP) +(1 - AA) * self.AccXangle
                        self.CFangleY = AA * (self.CFangleY + self.rate_gyr_y * LP) +(1 - AA) * self.AccYangle

                        #Kalman filter used to combine the accelerometer and gyro values.
                        self.kalmanY = self.kalmanFilterY(self.AccYangle, self.rate_gyr_y, LP)
                        self.kalmanX = self.kalmanFilterX(self.AccXangle, self.rate_gyr_x, LP)

                        ####################################################################
                        ##########Direction Requirement#######MAG direction ################
                        ####################################################################
                        #If IMU is upside down, then use this line.  It isnt needed if the
                        # IMU is the correct way up
                        #MAGy = -MAGy
                        #
                        ############################ END ##################################

                        #Calculate heading with Radian to Degree conversion
                        heading = 180 * math.atan2(self.MAGy,self.MAGx) / M_PI

                        #Only have our heading between 0 and 360
                        if heading < 0:
                                heading += 360

                        #Normalize accelerometer raw values.
                        self.accXnorm = self.ACCx / math.sqrt(self.ACCx * self.ACCx + self.ACCy * self.ACCy + self.ACCz * self.ACCz)
                        self.accYnorm = self.ACCy / math.sqrt(self.ACCx * self.ACCx + self.ACCy * self.ACCy + self.ACCz * self.ACCz)

                        ####################################################################
                        ##########Direction Requirement#####Calculate pitch and roll########
                        ####################################################################

                        #Us these two lines when the IMU is right side up.  IC's facing sky

                        pitch = math.asin(self.accXnorm)
                        roll = -math.asin(self.accYnorm / math.cos(pitch))
                        #
                        #Us these four lines when the IMU is upside down. IC's facing earth
                        #accXnorm = -accXnorm				#flip Xnorm as the IMU is upside down
                        #accYnorm = -accYnorm				#flip Ynorm as the IMU is upside down
                        #pitch = math.asin(accXnorm)
                        #roll = math.asin(accYnorm/math.cos(pitch))
                        #
                        ############################ END ##################################

                        #Calculate the new tilt compensated values
                        magXcomp = self.MAGx * math.cos(pitch) + self.MAGz * math.sin(pitch)
                        magYcomp = self.MAGx * math.sin(roll) * math.sin(pitch) + self.MAGy * math.cos(roll)-self.MAGz * math.sin(roll) * math.cos(pitch)

                        #Calculate tilt compensated heading w/ Radian to Degree conversion
                        tiltCompensatedHeading = 180 * math.atan2(magYcomp,magXcomp) / M_PI

                        if tiltCompensatedHeading < 0:
                            tiltCompensatedHeading += 360

                        #Error checking Section for trouble shooting
                        if 0: #1:			#Change to '1' to show the angles from the accelerometer
                            print ("\033[1;34;40mACCX Angle %5.2f ACCY Angle %5.2f  \033[0m  " % (AccXangle, AccYangle)),

                        if 0: #1:			#Change to '0' to stop  showing the angles from the gyro
                            print ("\033[1;31;40m\tGRYX Angle %5.2f  GYRY Angle %5.2f  GYRZ Angle %5.2f" % (gyroXangle,gyroYangle,gyroZangle)),

                        if 0: #1:			#Change to '0' to stop  showing the angles from the complementary filter
                            print ("\033[1;35;40m   \tCFangleX Angle %5.2f \033[1;36;40m  CFangleY Angle %5.2f \33[1;32;40m" % (CFangleX,CFangleY)),

                        if 0: #1:			#Change to '0' to stop  showing the heading
                            print ("HEADING  %5.2f \33[1;37;40m tiltCompensatedHeading %5.2f" % (heading,tiltCompensatedHeading)),

                        if 0: #1:			#Change to '0' to stop  showing the angles from the Kalman filter
                            print ("\033[1;31;40m kalmanX %5.2f  \033[1;35;40m kalmanY %5.2f  " % (kalmanX,kalmanY))


                        #slow program down a bit, makes the output more readable
                        #time.sleep(0.03)        #disable while not using loop features
                        break                  #this is disabliling the while loop for Node.js Control

                        #Output to stdout if running stand alone or passed to node.js control program through flush call
                        #print("%d,%5.6f,%5.2f,%5.2f,%5.2f,%5.2f,%5.2f,%5.2f,%5.2f,%5.2f,%5.2f,%5.2f" % (num, heading, self.AccXangle, self.AccYangle, self.gyroXangle, self.gyroYangle, self.gyroZangle, self.CFangleX, self.CFangleY, tiltCompensatedHeading, self.kalmanX, self.kalmanY))
                        #print("%d Heading %5.8f" % (n,heading))
                        #sys.stdout.flush()     #used to pass data back to node.js
                return heading
                        

#newIMU = IMU()
#heading = newIMU.getAllReadings()
#print(heading)
