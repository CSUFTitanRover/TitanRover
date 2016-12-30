File IMU_Acc_Mag_Gyro.py
==============================================================================================================================

This program will read the IMU registers and provide heading, pitch, roll angles.  Written to function with the Adafruit 10-DOF 
IMU Breakout board which has the following chips:

1. LSM303DLHC - Accelerometer Compass
2. L3DG20H - Gyroscope
3. BMP180 - Barometric/Temperature sensor

Communication: I2C
==============================================================================================================================

Version:  1.0 
=============
Date:  12/29/16
=============
Provides output for all axis information.  Software bug for chip orientation if flipped over.

