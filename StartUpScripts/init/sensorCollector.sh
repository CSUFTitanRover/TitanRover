#!/bin/bash

#====== BEGIN INIT INFO ======
# Author: 		Joseph Porter
# Default-Start:	5
# Default-Stop:		0 6
# Description: 		Will start the sensor Collector node module at start of computer
#====== END INIT INFO ======

# To run a different process replace the placePID and NAME with the process 
placePID="/sensorCollector.pid"
NAME="/sensorCollector.js"
pathToFile="/home/pi/TitanRover/DataTransfer"
PIDFile=${pathToFile}${placePID}


	# Linux will pass these arguments when it starts|stops|restarts if the script is in the rc[level].d directory
case "$1" in

	start)
		echo "Starting $NAME"
		
		# Log it into syslog to make sure it is working
		logger -i "Starting ${NAME}"

		# The & means we will run the process in the background
		node ${pathToFile}${NAME} & echo $! > $PIDFile
		;;

	stop)
		echo "Stopping $NAME"

		# Log it into syslog to make sure it is working
		logger -i "Stopping ${NAME}"

		# This command will send SIGINT to the process
		kill -2 `cat $PIDFile`
		rm $PIDFile
		;;

	restart|reload|force-reload)
		echo "Restarting $NAME"
		logger -i "Restarting ${NAME}"
		
		# This command will send SIGINT to the process
		kill -2 `cat $PIDFile`
		rm $PIDFile

		# Will run the process after killing it
		node ${pathToFile}${NAME} & echo $! > $PIDFile
		;;

	status)
		echo "Checking the status of $NAME"
		
		# Check if the PID exits
		if [[ -f $PIDFile ]]; then
			printf "\n\tFound PID: here is some stats\n\n"
			cat /proc/`cat $PIDFile`/status
			cat /proc/`cat $PIDFile`/sched
		else
			echo "==== Seems $NAME is not started ===="
		fi
		;;

	*)	# if none of the above conditions are met there was an error and should exit with code 1
		echo "Do not recognize that command"
		printf "\nUsage: $NAME {start|stop|restart|reload|force-reload|status}\n\n"
		exit 1
		;;

esac

exit 0
