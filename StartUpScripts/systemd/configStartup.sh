#!/bin/bash

# Author: Joseph Porter
# Description: Will configure the rover on all the startup services that need
#	to be enabled.  ONLY NEEDS TO BE RUN ONCE


echo "Starting to configure Rover!!"

# Loop through all the service  files and enable them with sytemd
for i in $(find . -type f -name '*.service')
do
	printf "\nSetting up ${i}\n"
	sudo cp $i /etc/systemd/system/
	i=${i:2}	
	sudo systemctl enable $i
	sudo systemctl start $i
	printf "\nThe status of ${i}: \n"
	sudo systemctl status $i
done

echo "Finished Script"	
