#!/bin/bash


# Just for testing purposes will send data to the server 50 times

for i in $(seq 1 50)
do
	# Run command to send data to server
	node example_client.js

	# Sleep for 300 miliseconds
	sleep 0.3
done
