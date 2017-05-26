#!/usr/bin/env python

import time

import pigpio # http://abyz.co.uk/rpi/pigpio/python.html

class PWM_read:
   def __init__(self, pi, gpio):
      self.pi = pi
      self.gpio = gpio

      self._high_tick = None
      self._p = None
      self._hp = None

      self._cb = pi.callback(gpio, pigpio.EITHER_EDGE, self._cbf)

   def _cbf(self, gpio, level, tick):
      if level == 1:
         if self._high_tick is not None:
            self._p = pigpio.tickDiff(self._high_tick, tick)
         self._high_tick = tick
      elif level == 0:
         if self._high_tick is not None:
            self._hp = pigpio.tickDiff(self._high_tick, tick)
      if (self._p is not None) and (self._hp is not None):
         print("g={} f={:.1f} dc={:.1f}".
            format(gpio, 1000000.0/self._p, 100.0 * self._hp/self._p))
	 print("g={} f={:.1f} pulse length={}".format(gpio, 1000000.0/self._p, self._hp))

   def cancel(self):
      self._cb.cancel()

pi = pigpio.pi()

p1 = PWM_read(pi, 4)


time.sleep(60)

p1.cancel()


pi.stop()