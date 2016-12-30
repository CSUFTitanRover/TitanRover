#!/bin/bash

#========================
# Author: Joseph Porter
# Description: 
# 	Will start the sensor Collector node module at start of computer
#=======================

pathToFile="/Users/josephporter/Documents/TitanRover/DataTransfer"
case "$1" in
	
	# Linux will pass these arguments when it starts|stops|restarts if the script is in the rc[level].d directory
	start)
		echo "Starting the SensorCollector.js node file"
		cd $pathToFile
		node sensorCollector.js
		;;
	stop)
		echo "Stopping the SensorCollector.js node file"
		kill -2 `pgrep -n -f 'node sensorCollector.js'`
		;;
	restart|reload|force-reload)
		echo "Restarting SensorCollector.js node file"
		kill -2 `pgrep -n -f 'node sensorCollector.js'`
		node sensorCollector.js
		;;
	*)
		echo "Error has occured"
		exit 1
		;;

esac

exit 0
