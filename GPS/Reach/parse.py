#!/usr/bin/python

reach_file = open("file.llh", "r", -1)

gps_data = ['a']

while not gps_data[0].isdigit():
    data_line = reach_file.readline()
    gps_data = data_line.split(" ")

print data_line

print gps_data[0]
print gps_data[1]
print gps_data[2]
print gps_data[3]
print gps_data[4]

reach_file.close()

