#!/usr/bin/python

reach_file = open("file.llh", "r", -1)

nema_data = ['a']

while not nema_data[0].isdigit():
    data_line = reach_file.readline()
    nema_data = data_line.split(" ")

gps_data = [float(nema_data[4]), float(nema_data[5]), float(nema_data[33])]

for i in gps_data:
    print i

while data_line:
    data_line = reach_file.readline()
    #print data_line
    if not data_line: 
        break
    data_line2 = data_line    
    print 'stuff ' + data_line2    
    
print 'final' + data_line2

#Enable this section including for Loop to check data#########
#print data_line
#n = 0
#for i in gps_data:
#    print str(n) + ' ' + i  # 
#    n+=1
##############################################################

reach_file.close()

