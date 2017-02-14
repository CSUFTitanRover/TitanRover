/*
Provided to you by Emlid Ltd (c) 2014.
twitter.com/emlidtech || www.emlid.com || info@emlid.com

Example: Read accelerometer, gyroscope and magnetometer values from
MPU9250 inertial measurement unit over SPI on Raspberry Pi + Navio.

Navio's onboard MPU9250 is connected to the SPI bus on Raspberry Pi
and can be read through /dev/spidev0.1

To run this example navigate to the directory containing it and run following commands:
make
./AccelGyroMag
*/

#include "MPU9250.h"
#include <iostream>

using namespace std;

//=============================================================================

int main()
{
	//-------------------------------------------------------------------------

	MPU9250 imu;
	imu.initialize();

    return (int)!imu.doSelfTest();
}

//	float ax, ay, az, gx, gy, gz, mx, my, mz;

	//-------------------------------------------------------------------------

//	float d[6] = {};

//	if (imu.doSelfTest())
//	{
//		printf("MPU9250 self test passed\n");
//	} else {
//		printf("MPU9250 self test failed");
//		return 0;
//	}

    
//    while(1)
//	{
//        	imu.getMotion9(&ax, &ay, &az, &gx, &gy, &gz, &mx, &my, &mz);
//
//        	printf("Acc: %+05.3f %+05.3f %+05.3f ", ax, ay, az);
//        	printf("Gyr: %+05.3f %+05.3f %+05.3f ", gx, gy, gz);
//		printf("Mag: %+05.3f %+05.3f %+05.3f\n", mx, my, mz);
//
//	        sleep(0.5);
//    	}
//
//	return 1;

