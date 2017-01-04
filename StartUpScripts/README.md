# Start Up Scripts

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


Place S in front of name followed by the sequence when it should be executed then followed by the ScriptName  
```ln -s path_to_script /etc/rc[level].d/S[sequenceNum][scriptName]```  

Place K in front of name followed by the sequence when it should be stopped then followed by the ScriptName  
```ln -s path_to_script /etc/rc[level].d/K[sequenceNum][scriptName]```  


