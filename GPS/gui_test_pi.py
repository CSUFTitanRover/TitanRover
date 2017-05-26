# Program: gui_test.py
#
# Description: Program using a global positioning system module (Adafruit Ultimate GPS ) to get 
#              longitude and latitude coordinates. States and shows the distance between current location
#              and desired waypoint. Gets a static Google map and paints it on screen (when REFRESH is pressed)
#              This GUI was made for testing purposes only, to get a better looking GPS information and to
#              test and see how accurate the coordinates are on said map. 
#              Note: must be connect to internet to recieve map.
#
#
# Fake Copyright (c) 2016 Matthew Grove
# No rights reserved.
#
 
from Tkinter import *
from PIL import ImageTk, Image
from gps import *
import psutil, os, time, random, urllib, cStringIO, threading, tkMessageBox
import json, datetime, pymongo
from pymongo import MongoClient


root = Tk()
gpsd = None


def doNothing():
    print("Doesn't do shit....")


def startProgram():
    os.system('clear')
    print("Starting Program...")
    status.configure(text="Starting...")
  

def refreshProgram():
    os.system('clear')
    print("Refreshing...")

    if simulation == 'yes':
        lat = random.uniform(33.880000,33.88300)
        lon = random.uniform(-117.882000,-117.8828000)
        gpsTime = datetime.datetime.now().strftime('%Y-%m-%d:%H-%M-%S')
    else:
        lat = gpsd.fix.latitude
        lon = gpsd.fix.longitude
        gpsTime = gpsd.fix.time
        
    createMap(lat, lon, "", "", gpsTime)
    databaseHandler(lat, lon, gpsTime)
    

def quitProgram():
    if simulation == 'no':
        print "\nKilling Thread..."
        gpsp.running = False
        # wait for the thread to finish
        gpsp.join()
    root.quit()
    print "Done.\nExiting."

    
def createMap(lat, lon, waypointLat, waypointLon, gpsTime):
    os.system('clear')
    print lat
    print lon
    print psutil.cpu_percent()
    
    status.configure(text="Updating...")
    time_result.configure(text=datetime.datetime.now().strftime('%Y-%m-%d:%H-%M-%S'))
    gps_time_result.configure(text = gpsTime)
    lat_result.configure(text="%3.6f"%lat)
    long_result.configure(text="%3.6f"%lon)
    cpu_result.configure(text=psutil.cpu_percent())
    
    marker_path = []
    marker_list = []
    marker_list.append("markers=size:mid|label:A|color:green|%3.6f,%3.6f|" % (lat,lon))

    if waypointLat != "":
        marker_list.append("markers=size:mid|label:B|color:red|%3.6f,%3.6f|" % (waypointLat,waypointLon))
        marker_path.append("path=color:0xff0000ff|weight:5|%3.6f,%3.6f|%3.6f,%3.6f" % (lat,lon,waypointLat,waypointLon))  
        refineZoom = 20
    else:
        refineZoom = 20
        
    staticGoogleMap("gmaps_image", center="Float.toString(latf),Float.toString(lonf)", zoom=refineZoom, imgsize=(550,350),imgformat="jpg", maptype="satellite",markers=marker_list,path=marker_path )

    mapImage2 = ImageTk.PhotoImage(Image.open("gmaps_image.jpg"))
    map_label.configure(image = mapImage2)
    map_label.image = mapImage2
    
    root.update_idletasks()


def setWaypoint():    
    latWaypoint = lat_entry.get()
    lonWaypoint = long_entry.get()    

    if simulation == 'yes':
        lat = random.uniform(33.880000,33.88300)
        lon = random.uniform(-117.882000,-117.8828000)
        gpsTime = datetime.datetime.now().strftime('%Y-%m-%d:%H-%M-%S')
    else:
        lat = gpsd.fix.latitude
        lon = gpsd.fix.longitude
        gpsTime = gpsd.fix.time

    # in case someone pushes button without value
    if latWaypoint != "":
        #convert from string to float
        latWaypoint = float(latWaypoint)
        lonWaypoint = float(lonWaypoint)
        createMap(lat, lon, latWaypoint,lonWaypoint, gpsTime)
        haversineFunc(lat, lon, latWaypoint, lonWaypoint)
        databaseHandler(lat, lon, gpsTime)
    else:
        print ('WARNING: MUST SET WAYPOINT')

    
def haversineFunc(lat, lon, latWaypoint, lonWaypoint):
    # radius of the earth in km
    earthRadius = 6371 

    #from A coordinates to B coordinates: set values here
    latValueA, longValueA = lat, lon
    latValueB, longValueB =  latWaypoint, lonWaypoint

    latA = math.radians(latValueA)
    longA = math.radians(longValueB)
    latB = math.radians(latValueB)
    longB = math.radians(longValueB)

    latnlat = (latB - latA)
    longnlong = (longB - longA)

    # haverfine formula
    alpha = ((math.pow(math.sin(latnlat/2),2)) + ((math.cos(latA) * math.cos(latB)) * (math.pow(math.sin(longnlong/2),2))))
    beta = 2 * (math.atan2(math.sqrt(alpha), math.sqrt(1-alpha)))
    delta = earthRadius * beta

    dist_result.configure(text = "%.14f km\n%.14f m\n%.14f ft" % (delta, (delta * 1000), (delta / 0.0003048)))
    print ('\nKilometers:  %.14f' % (delta))
    print ('Meters:      %.14f' % (delta * 1000))
    print ('Feet:       %.14f\n' % (delta / 0.0003048)) # 1 foot = 0.0003048 kilometers


def databaseHandler(lat, lon, gpsTime):
    lat = ("%3.6f" % lat)
    lon = ("%3.6f" % lon)
    gpsTime = datetime.datetime.now().strftime('%Y-%m-%d:%H-%M-%S')

    dict_coords = {
        "latitude": lat,
        "longitude": lon,
        "time": gpsTime
    }

    foo = json.dumps(dict_coords)
    with open("gps_data.txt", "w") as f:
        f.write(foo)

    with open("gps_data.json", "w") as f:
        f.write(foo)
    
    client = MongoClient()

    db = client.gps_database
    collection = db.gps_collection

    collection_id = collection.insert_one(dict_coords).inserted_id
    collection_id

    # this is just for show
    text = database_result.cget("text") + foo
    database_result.configure(text="%s\n" % text)


class GpsPoller(threading.Thread):
  def __init__(self):
    threading.Thread.__init__(self)
    #brought in scope
    global gpsd
    #starting stream of info
    gpsd = gps(mode=WATCH_ENABLE)
    self.current_value = None
    #thread running to true
    self.running = True 
 
  def run(self):
    global gpsd
    while gpsp.running:
      #continue loop and grab each set of gpsd data to clear buffer
      gpsd.next()

    
if __name__=='__main__':
    #setting up main window
    root.title('Global Position System Test')
    root.minsize(width = 900, height = 680)
    root.resizable(width = False, height = False)

    #asks to run as simulator or not(no gps module)
    simulation = tkMessageBox.askquestion('Question','Run As Simulator?')

    if simulation == 'no':
        #create thread
        gpsp = GpsPoller()
        try:
            #start up
            gpsp.start()
        except (KeyboardInterrupt, SystemExit): #when you press ctrl+c
            print "\nKilling Thread..."
            gpsp.running = False
            gpsp.join() # wait for the thread to finish
            print "Done.\nExiting."

        lat = gpsd.fix.latitude
        lon = gpsd.fix.longitude
        gpsTime = gpsd.fix.time
    else:
        lat = random.uniform(33.880000,33.88300)
        lon = random.uniform(-117.882000,-117.8828000)
        gpsTime = datetime.datetime.now()
        
    startingX = 25
    startingY = 25
    fontType = "Courier"
    fontSizeGPSLog = 10
    refineZoom = 20
    
    menu = Menu(root)
    root.config(menu=menu, bg="white")

    subMenu = Menu(menu)
    menu.add_cascade(label="File", menu=subMenu)
    subMenu.add_command(label="New Project", command=doNothing)
    subMenu.add_command(label="New", command=doNothing)
    subMenu.add_separator()
    subMenu.add_command(label="Exit", command=root.quit)
    
    # labels
    label_lat = Label(root, text="Latitude: ", font=(fontType, fontSizeGPSLog),bg="white")
    label_lat.place(x = startingX, y = startingY)
    lat_result = Label(root, text="%3.6f"%lat, relief=RIDGE, font=(fontType, fontSizeGPSLog),bg="white")
    lat_result.place(x = startingX * 6, y = startingY)

    label_long = Label(root, text="Longitude: ", font=(fontType, fontSizeGPSLog), bg="white")
    label_long.place(x = startingX, y = startingY*2.5)
    long_result = Label(root, text="%3.6f"%lon, relief=RIDGE, font=(fontType, fontSizeGPSLog), bg="white")
    long_result.place(x = startingX * 6, y = startingY * 2.5)
    
    time_label = Label(root, text="Time: ", font=(fontType, fontSizeGPSLog), bg="white")
    time_label.place(x = startingX, y = startingY * 4)
    time_result = Label(root, text="%6.2f"%time.time(), relief = RIDGE, font=(fontType, fontSizeGPSLog), bg="white")
    time_result.place(x = startingX * 6, y = startingY * 4)

    heading_label = Label(root, text="Heading: ", font=(fontType, fontSizeGPSLog), bg="white")
    heading_label.place(x = startingX, y = startingY * 5.5)
    heading_result = Label(root, text="NULL", relief = RIDGE, font=(fontType, fontSizeGPSLog), bg="white")
    heading_result.place(x = startingX * 6, y = startingY * 5.5)

    gps_time_label = Label(root, text="GPS FIX Time:", font=(fontType, fontSizeGPSLog), bg="white")
    gps_time_label.place(x = startingX, y = startingY*7)
    gps_time_result = Label(root, text=gpsTime, relief=RIDGE, font=(fontType, fontSizeGPSLog - 1), bg="white")
    gps_time_result.place(x = startingX*6, y = startingY*7)

    cpu_label = Label(root, text="CPU %: ", font=(fontType,fontSizeGPSLog), bg="white")
    cpu_label.place(x=startingX*31, y=startingY*19)
    cpu_result = Label(root,text=psutil.cpu_percent(), relief=RIDGE,font=(fontType,fontSizeGPSLog), bg="white")
    cpu_result.place(x=startingX*33, y=startingY*19)

    waypoint_label = Label(root, text="Set a Waypoint", font=(fontType, fontSizeGPSLog + 2), bg="white")
    waypoint_label.place(x = startingX * 3, y = startingY * 9)

    lat_entry_label = Label(root, text="Latitude: ", font=(fontType, fontSizeGPSLog), bg="white")
    lat_entry_label.place(x = startingX, y = startingY * 11)

    long_entry_label = Label(root, text="Longitude: ", font=(fontType, fontSizeGPSLog), bg="white")
    long_entry_label.place(x = startingX, y = startingY * 12.5)

    distance_label = Label(root, text="Distance", font=(fontType, fontSizeGPSLog), bg="white")
    distance_label.place(x = startingX, y = startingY * 14.5)
    dist_result =  Label(root, text="NULL", font=(fontType, fontSizeGPSLog), bg="white")
    dist_result.place(x = startingX * 5.5, y = startingY * 14.5)

    database_label = Label(root, text="Database Activity:", font=(fontType, fontSizeGPSLog), bg="white")
    database_label.place(x =  startingX * 19, y = startingY * 20)
    database_result = Label(root, text="", justify=CENTER, width=50, height=7, relief=RAISED, wraplength=400, font=(fontType, fontSizeGPSLog), bg="white")
    database_result.place(x = startingX * 19, y = startingY * 21)
    
    # waypoint entries
    lat_entry = Entry(root, width = 12)
    lat_entry.place(x = startingX * 6, y = startingY * 11)
    long_entry = Entry(root, width = 12)
    long_entry.place(x = startingX * 6, y = startingY * 12.5)
    
    # status bar    
    status = Label(root, text="Waiting...", bd=2, relief=SUNKEN, anchor=W, font=(fontType, 12), bg="white")
    status.pack(side=BOTTOM, fill=X)

    # checkboxes - not in use
    check = Checkbutton(root, text="Real Time", font=(fontType, 14), bg="white")
    check.place(x = startingX * 13, y = startingY * 15.5)

    # buttons
    button_Start = Button(root, text="START", width = 10, height = 5, font=(fontType,fontSizeGPSLog), bg="white", command=startProgram, highlightthickness=0)
    button_Start.place(x = startingX, y = startingY * 21)

    button_Stop = Button(root, text="QUIT", width = 10, height = 5, font=(fontType,fontSizeGPSLog), bg="white", command=quitProgram,highlightthickness=0)
    button_Stop.place(x = startingX * 7, y = startingY * 21)

    button_Refresh = Button(root, text="REFRESH", width=10, height=5, font=(fontType,fontSizeGPSLog), bg="white",  command=refreshProgram,highlightthickness=0)
    button_Refresh.place(x = startingX*13, y = startingY*21)

    button_increasezoom = Button(root, text="+", width=2,height=2, font=(fontType, fontSizeGPSLog),command=doNothing, bg="white",highlightthickness=0)
    button_increasezoom.place(x=startingX*33,y=startingY*16)

    button_Waypoint = Button(root, text="SET\n(REFRESH)", width = 8, height = 5, font=(fontType, fontSizeGPSLog), bg = "white", command=setWaypoint,highlightthickness=0) 
    button_Waypoint.place(x = startingX, y = startingY * 16)
        
    #  image of map on label
    mapImage = ImageTk.PhotoImage(Image.open("gmaps_image.jpg"))
    map_label = Label(root,  width=550, height=350, image = mapImage)
    map_label.place(x = startingX * 13, y = startingY)
    

# sends a url request to Google in order to get a JPEG image back, with respective coordinates  
def staticGoogleMap(filename_wo_extension, center=None, zoom=None, imgsize="500x500", imgformat="jpeg",
                          maptype="roadmap", markers=None, path=None ):  
    # assemble the URL
    url_request =  "http://maps.google.com/maps/api/staticmap?" # base URL, append query params, separated by &
   
    if center != None:
        url_request += "center=%s&" % center

    if center != None:
        url_request += "zoom=%i&" % zoom  # zoom 0 - 22
    
    # tuple of ints, up to 640 by 640
    url_request += "size=%ix%i&" % (imgsize)
    url_request += "format=%s&" % imgformat
    url_request += "maptype=%s&" % maptype  # roadmap, satellite, hybrid, terrain

    # add markers (location and style)
    if markers != None:
        for marker in markers:
                url_request += "%s&" % marker
    if path != None:
        for paths in path:
            url_request += "%s&" % paths

    #url_request += "mobile=false&"
    # must be given, deals with mobile 
    url_request += "sensor=false&"
    print url_request
    
    # option 1: save image to disk
    urllib.urlretrieve(url_request, filename_wo_extension+"."+imgformat)
    
    # option 2: read into PIL 
    web_sock = urllib.urlopen(url_request)
    # constructs a StringIO holding the image
    imgdata = cStringIO.StringIO(web_sock.read())
    try:
        PIL_img = Image.open(imgdata)
    
    # if  cannot be read as image, probably error from the server,
    except IOError:
        # print error (or it may return a image showing the error"
        print "IOError:", imgdata.read()
    
    else:
        #PIL_img.show()
        PIL_img.save(filename_wo_extension+".jpg", "JPEG")
        print "saved"


root.mainloop()