import gps
import datetime

session = gps.gps("localhost", "2947")
session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)
report = session.next()
fileNameBeta=str(datetime.datetime.now().date())+str(datetime.datetime.now().time())
fileName=fileNameBeta.replace(":","")
log=open(fileName, 'w')
while True:
	try:
		report = session.next()
		if report['class']=='TPV':
			if hasattr(report, 'time'):
				print "Time: " + str(report.time) + "\n"
				log.write("Time: " + report.time + "\n")
			if hasattr(report, 'lat'):
				print "Latitude: " + str(report.lat) + "\n"
				log.write("Latitude: " + str(report.lat) + "\n")
			if hasattr(report, 'lon'):
				print "Longitude: " + str( report.lon) + "\n"
				log.write("Longitude: " + str(report.lon) + "\n")
			if hasattr(report, 'track'):
				print "Heading: " +str( report.track) + "\n"
				log.write("Heading: " + str(report.track) + "\n"+"\n")
	except KeyError:
		pass
	except KeyboardInterrupt:
		quit()
	except StopIteration:
		session = None
		print "GPSD has terminated"
