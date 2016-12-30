
//----
<h1>Rover Sensors</h1>
Name: Brandon Hawkinson </br>
Date: 12/29/16 </br>
year: master2017 </br>
subsystem: Science </br>
status: alpha </br></br>


Reference Links: </br>
<a>https://github.com/joranbeasley/SDISerial</a> </br>
<a>https://learn.adafruit.com/dht</a></br>
<a>http://www.instructables.com/id/Simple-Arduino-and-HC-SR04-Example/step3/Upload-the-sketch/</a>
<a>https://github.com/CSUFTitanRover/TitanRover/blob/master2017/DataTransfer/ScienceSensors/ScieceCache/ScieceCache.ino</a>

Information:</br>
The arduino is handling critical sensors on the rover, the arduino acts as a data logger in the relationship with the raspberry pi. Data will only be flowing into the raspberry pi from the arduino. Currently the only sensors working on the arduino are the Decagon 5TE, DHT11, and the Sonic Range Finder. Timing anaylsis has been done on the sensors and are here:</br>
![screenshot](https://github.com/CSUFTitanRover/TitanRover/blob/master2017/DataTransfer/ScienceSensors/ScieceCache/README/ii_1591db219e0b94e7.png?raw=true)</br>

Things to note:
5TE: The Decagon 5TE sensor is an interrupt sensor and REQUIRES pin 1 or 2 on the arduino uno(only 2 interrupt capable pins avaliable). As a SDI serial input you need to close the serial connection before using another SDI serial input. 
