# Start Up Scripts


To get these scripts to work on startup place a symbolic link into the rc[level].d file  
These are located in /etc  

## Linux init.d levels  
0) Shutdown  
1) Userlevel Mode  
2 - 5) Place our startup scripts here  
6) reboot  

## Link script in level  

Need to place the symbolic link into the level.  


Place S in front of name followed by the sequence when it should be executed then followed by the ScriptName  
```ln -s path_to_script /etc/rc[level].d/S[sequenceNum][scriptName]```  

Place K in front of name followed by the sequence when it should be stopped then followed by the ScriptName  
```ln -s path_to_script /etc/rc[level].d/K[sequenceNum][scriptName]```  


