# Data Communication  
Name: Joseph Porter  
Date: 1/3/17  
year: master2017  
subsystem: Communications  
status: beta  


## Information  
The data from all the subsystems located on the rover are being transfered over to the homebase station using the ```sensorCollector.js``` node module. The data is coming from the arduino microcontroller and is using its serial connection to transfer the sensor readings.  

## How to start  
1. Make sure [MongoDB](#running-mongodb) is running on server computer  
2. Execute the [Homebase](#homebase-server) server  
	```node homebase_server.js```  
3. Make sure pi is running [collector](#data-collector)  
	```node sensorCollector.js```  
4. Start the UI by running this command within the roverUI folder  
	```npm start```  


### Running MongoDB

#### Getting the DB working
1. First download MongoDB for your system
   [Mongo Website](https://www.mongodb.com/)
2. Create /data/db directories in your root folder  
	```sudo mkdir /data```  
	```sudo mkdir /data/db```  
3. Then navigate to the bin directory of the downloaded folder
4. Run the mongo server (needs to have root permissions)  
	```sudo mongod --port 6969```  

#### Using the client  
The client will let you access the DB without having to use the UI or homebase_server to access it. Used for debugging.  

1. Navigate to the bin directory of the mongodb folder
2. Run the mongo client  
	```sudo mongo --port 6969```  
	
This will return all the data place a query in find() to filter results.  
### Homebase Server  

The homebase server will accept any JSON data sent to it, and store this data into a MongoDB to be queried later.  
It will also allow the UI to stream the data back to it using socket.io.  

*TASKS*  
- [x] Have server listen for data  
- [x] Store the data into a MongoDB  
- [x] Integrate Socket.io to send data back  
- [x] Allow UI to query historical data  

#### API Endpoints  
*Send Data*
- {ip-address}:{port of server}/data  
> Accepts one data point at a time  
- {ip-address}:{port of server}/dataMulti  
> Accepts multiple data points at a time  

*Retrieve Data*  
- {ip-address}:{port of server}/getdata/{id of data}  
> Will return all data with that given ID in JSON format or return error message
- {ip-address}:{port of server}/getdata/{id of data}/{startTime}/{endTime}  
> Will return JSON of given ID between the start and end time.  

#### Ports in Use  
- MongoDB 6969  
- UI      3000  
- Server  6993  

### Data Collector  

The sensor collector process will be parsing the serial data from the Arduino Mircocontroller and sending it back home to homebase_server.  

*TASKS*  
- [x] Parse the serial data  
- [x] Have data transfer to Home Server  
- [x] Have it store data after a connection loss  
- [ ] Gather data other than serial data  

For more info on the sensors [Rover Sensors README](https://github.com/CSUFTitanRover/TitanRover/blob/master2017/DataTransfer/ScienceSensors/ScieceCache/README/readme.md) will have more information.  


