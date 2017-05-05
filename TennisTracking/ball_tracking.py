import cv2
import urllib.request
import numpy as np
import argparse
from collections import deque
import imutils


# set the default value for the buffer
args = {'video': None, 'buffer': 64}

# define the lower and upper boundaries of the "green"
# ball in the HSV color space, then initialize the
# list of tracked points
greenLower = (29, 86, 6)
greenUpper = (64, 255, 255)
pts = deque(maxlen=args["buffer"])

# initialize the frame counter and the cordinate deltas
counter = 0
(dX, dY) = (0,0)
direction = ""

# define the camera to be the reference to the IP camera stream
camera = urllib.request.urlopen('http://itwebcammh.fullerton.edu/mjpg/video.mjpg')

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
			if radius > 10:
				# draw the circle and centroid on the frame,
				# then update the list of tracked points
				cv2.circle(frame, (int(x), int(y)), int(radius), (0,255,255), 2)
				cv2.circle(frame, center, 5, (0,0, 255), -1)
				# update the points queue
				pts.appendleft(center)



		# loop over the set of tracked points
		for i in np.arange(1, len(pts)):
			# if either of the tracked points are None, ignore them
			if pts[i -1] is None or pts[i] is None:
				continue
			# check to see if enough points have been accumulated in buffer
			if counter >= 10 and i ==1 and pts[-10] is not None:
				# compute the difference between x and y and re-initialize the direction txt variables
				dX = pts[-10][0] - pts[i][0]
				dY = pts[-10][1] - pts[i][1]
				(dirX, dirY) = ("","")

				# ensure there is significant movement in the x direction
				if np.abs(dX) > 20:
					# x direction
					if np.sign(dX) == 1:
						dirX = "East"
					else:
						dirX = "West"

				if np.abs(dY) > 20:
					# y direction
					if np.sign(dY) == 1:
						dirX = "North"
					else:
						dirX = "South"

				# handle when both directions are non-empty
				if dirX !="" and dirY !="":

					direction = "{}-{}".format(dirY, dirX)
				# otherwise only one direction is non-empty
				else:
					direction = dirX if dirX != "" else dirY

				# compute the thickness of the line and draw connecting lines
				thickness = int(np.sqrt(args["buffer"] / float(i + 1)) * 2.5)
				cv2.line(frame, pts[i - 1], pts[i], (0, 0, 255), thickness)

		# display the movement deltas and direction in the frame
		cv2.putText(frame, direction, (10,3), cv2.FONT_HERSHEY_SIMPLEX,0.65, (0, 0, 255),3)
		cv2.putText(frame, "dX: {}, dY: {}".format(dX, dY), (10,frame.shape[0]-10), cv2.FONT_HERSHEY_SIMPLEX,0.35, (0, 0, 255),1)


		# display the frame on the screen
		cv2.imshow('Frame', frame )
		key = cv2.waitKey(1) & 0xFF
		counter += 1

		if cv2.waitKey(1) == 27:
			exit(0)

# cleanup the camera and close any open windows
camera.release()
cv2.destroyAllWindows()
