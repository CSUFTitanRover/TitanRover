import cv2
import urllib.request
import numpy as np
import imutils

# define the lower and upper boundaries of the "green" ball in the HSV color space
greenLower = (29, 86, 6)
greenUpper = (64, 255, 255)

# initialize the cordinate deltas
(dX, dY) = (0,0)

# define the camera to be the reference to the IP camera stream
camera = urllib.request.urlopen('http://192.168.1.100/video.mjpg')

bytes = bytes()
while True:
	# manually parse the mjpeg stream without opencv
	bytes += camera.read(1024)
	a = bytes.find(b'\xff\xd8')
	b = bytes.find(b'\xff\xd9')
	if a != -1 and b != -1:
		jpg = bytes[a:b+2]
		bytes = bytes[b+2:]

		# grab the current frame
		frame = cv2.imdecode(np.fromstring(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)

		# resize the frame, blur it, and convert it to the HSV color space
		frame = imutils.resize(frame, width=600)

		# blurred = cv2.GaussianBlur(frame, (11,11), 0)
		hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

		# construct a mask for the color "green", then perform
		# a series of dilations and erosions to remove all small
		# blobs left in the mask
		mask = cv2.inRange(hsv, greenLower, greenUpper)
		mask = cv2.erode(mask, None, iterations=2)
		mask = cv2.dilate(mask, None, iterations=2)

		# find contours in the mask and initialize the current
		# (x,y) center of the ball
		cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2]
		center = None

		# only proceed if at least one contour was found
		if len(cnts) > 0:
			# find the largest contour in the mask, then use
			# it to compute the minimum enclosing circle and centroid
			c = max(cnts, key=cv2.contourArea)
			((x,y), radius) = cv2.minEnclosingCircle(c)
			M = cv2.moments(c)
			center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))

			# only proceed if the radius meets a minimum size
			if radius > 5:
				# draw the circle and centroid on the frame,
				# then update the list of tracked points
				cv2.circle(frame, (int(x), int(y)), int(radius), (0,255,255), 2)
				cv2.circle(frame, center, 5, (0,0, 255), -1)

		if center != None:
			if center[0] >= 200 and center[0] <= 350:
				print("ball centered")
			elif center[0] < 200:
				print("move left")
			elif center[0] > 350:
				print("move right")

		# display the frame on the screen
		cv2.imshow('Frame', frame )
		key = cv2.waitKey(1) & 0xFF

		if cv2.waitKey(1) == 27:
			exit(0)

# cleanup the camera and close any open windows
camera.release()
cv2.destroyAllWindows()
