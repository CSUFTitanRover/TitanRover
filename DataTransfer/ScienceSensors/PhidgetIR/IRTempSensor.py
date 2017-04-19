from Phidgets.PhidgetException import *
from Phidgets.Events.Events import *

from Phidgets.Devices.TemperatureSensor import TemperatureSensor

try:
    temperatureSensor = TemperatureSensor()
except RunTimeError as e:
    print("Runtime Exception: %s" % e.details)
    print("Exiting...")
    exit(1)

def DisplayDeviceInfo():
    inputCount = temperatureSensor.getTemperatureInputCount()
    print("|------------|----------------------------------|--------------|------------|")
    print("|- Attached -|-              Type              -|- Serial No. -|-  Version -|")
    print("|------------|----------------------------------|--------------|------------|")
    print("|- %8s -|- %30s -|- %10d -|- %8d -|" % (temperatureSensor.isAttached(), temperatureSensor.getDeviceName(), temperatureSensor.getSerialNum(), temperatureSensor.getDeviceVersion()))
    print("|------------|----------------------------------|--------------|------------|")
    print("Number of Temperature Inputs: %i" % (inputCount))
    for i in range(inputCount):
        print("Input %i Sensitivity: %f" % (i, temperatureSensor.getTemperatureChangeTrigger(i)))

def TemperatureSensorAttached(e):
    attached = e.device
    print("TemperatureSensor &i Attached!" % (attached.getSerialNum()))

def TemperatureSensorDetached(e):
    detached = e.device
    print("TemperatureSensor %i Detached!" % (detached.getSerialNum()))

def TemperatureSensorError(e):
    try:
        source = e.device
        if source.isAttached():
            print("TemperatuerSensor %i: Phidget Error %i: %s" % (source.getSerialNum(), e.eCode, e.description))
    except PhidgetException as e:
        print("Phidget Exception %i: %s" % (e.code, e.details))

def TemperatureSensorTemperatureChanged(e):
    try:
        ambient = temperatureSensor.getAmbientTemperature()
    except PhidgetException as e:
        print("Phidget Exception %i: %s" % (e.code, e.details))
        ambient = 0.00
    
    source = e.device
    print("Temperature: %f (Ambient Temperature: %f)" % (e.temperature, ambient))

#Main Program Code
try:
    temperatureSensor.setOnAttachHandler(TemperatureSensorAttached)
    temperatureSensor.setOnDetachHandler(TemperatureSensorDetached)
    temperatureSensor.setOnErrorhandler(TemperatureSensorError)
    temperatureSensor.setOnTemperatureChangeHandler(TemperatureSensorTemperatureChanged)
except PhidgetException as e:
    print("PhidgetException %i: %s" & (e.code, e.details))
    print("Exiting....")
    exit(1)

print("Opening phidget object...")

try:
    temperatureSensor.openPhidget()
except PhidgetException as e:
    print("Phidget Exception %i: %s" % (e.code, e.details))
    print("Exiting....")
    exit(1)

print("Waiting for attach....")

try:
    temperatureSensor.waitForAttach(10000)
except PhidgetException as e:
    print("Phidget Excecption %i: %s" % (e.code, e.details))
    try:
        temperatureSensor.closePhidget()
    except PhidgetException as e:
        print("Phidget Exception %i: %s" % (e.code, e.details))
        print("Exiting...")
        exit(1)
    print("Exiting....")
    exit(1)
else:
    DisplayDeviceInfo()

print("Press Enter to quit....")
chr = sys.stdin.read(1)

print("Closing...")

try:
    temperatureSensor.closePhidget()
except PhidgetException as e:
    print("Phidget Exception %i: %s" % (e.code, e.details))
    print("Exiting....")
    exit(1)

print("Done.")
exit(0)
