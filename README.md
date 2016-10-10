# TitanRover17


Install Nodejs 

https://nodejs.org/en/download/package-manager/

Install dependencies with

```npm install``` 

Launch the app 

```node app.js ```

## Run servers

### Need to set up the MongoDB to get it working

1. First download MongoDB for your system
   [Mongo Website](https://www.mongodb.com/)
2. Create /data/db directories in your root folder
3. Then navigate to the bin directory of the downloaded folder
4. Run the mongo server (needs to have root permissions)  
	```sudo mongod --port 6969```
5. Then in other terminal run  
	```sudo mongo --port 6969```  
	This should connect you with the mongodb server running in other terminal
6. Run the homebase server  
	```node homebase_server.js```
7. Run the rover server to post data to homebase  
	```node rover_server.js```


To see if data was stored in the database in the terminal with mongo client running run this command  
	```db.data.find()```  
This should show all the data inserted into the database


If you want to change the data passed in the rover_server.js file modify the post_data object to whatever you want  
*Will need to have id in order for it to work*
