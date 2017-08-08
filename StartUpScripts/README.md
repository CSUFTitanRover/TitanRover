# Start Up Scripts
Two different kinds of startup depends on the OS and the init program.  
The pi uses systemd as its startup init program so we have to change the scripts.  

## Systemd new way  

Systemd runs as a init program and launches daemons at boot time. It stores its services information in the /etc/systemd/system directory. It will find the services it needs to run from within there and run them at startup.  

### To set up out startup  
Replace roverControl.service with any service that needs to start on startup.  
Our services are located in /TitanRover/StartUpScripts/systemd.
  
1. Copy script to directory  
	```sudo cp roverControl.service /etc/systemd/system```  
2. Enable the service  
	```sudo systemctl enable roverControl.service```  
3. Start the service  
	```sudo systemctl start roverControl.service```  
4. Verifiy it's started  
	```systemctl status roverControl.service```  

This will then persist after shutdown, and will start the service on startup.  

[Click here](https://www.axllent.org/docs/view/nodejs-service-with-systemd/) for more info.  

## Old rc[level] way
These scripts will let the rover start the necessary modules in order to let the rover perform its functions.  

To get these scripts to work on startup place a symbolic link into the rc[level].d file  
These are located in /etc and are run by init on boot.  
Linux's init module that runs right after boot looks into these rc[level].d directories to see what scripts to run.  It will then run them in sequencial order based on how they are named. 

This ```S01cups``` will run before ```S04smtp```  

If the first character is S it will pass start as its argument if its a K it will pass stop.   

To see better examples and more info [Click Here](http://www.tldp.org/HOWTO/HighQuality-Apps-HOWTO/boot.html)  

## Linux init.d levels  

For more information about the init.d run levels [Click Here](http://www.tldp.org/LDP/sag/html/run-levels-intro.html)  

0) 		Shutdown  
1) 		Userlevel Mode  
2-5) 	Place our startup scripts here  
6) 		reboot  

## Link script in level  

Need to place the symbolic link into the level.  

These scripts are usually located in /etc/init.d, but since we are using a github directory we just have to link from there instead on /etc/init.d  

Our startup Scripts are located in /TitanRover/StartUpScripts/init


Place S in front of name followed by the sequence when it should be executed then followed by the ScriptName  
```ln -s path_to_script /etc/rc[level].d/S[sequenceNum][scriptName]```  

Place K in front of name followed by the sequence when it should be stopped then followed by the ScriptName  
```ln -s path_to_script /etc/rc[level].d/K[sequenceNum][scriptName]```  


## Also see Reach Startup Script Requirements
[Emlid Reach Communication](https://github.com/CSUFTitanRover/TitanRover/blob/develop/GPS/Reach/README.md)
