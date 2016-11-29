#include <Servo.h>

#define ESC_OUT_PIN 9

#define CAL_SIGNAL 1500
#define TEST_SIGNAL 1650

Servo motor;

unsigned long ulTimeStart;
unsigned long loops;
unsigned long ulTimeNow;

void setup() {
  //initialize Serial output
  Serial.begin(9600);
  
  //attach output pins
  motor.attach(ESC_OUT_PIN);

  //Calibrate ESCs with idle signal
  setSpeedSignal(CAL_SIGNAL);

  //initialize timer
  ulTimeStart = millis();

  //initiliaze cycle counter
  loops = 0;
}

void loop() {
  //Ensure ESCs are calibrated by sending idles signal for a
  //minimum of 4 seconds.
  ulTimeNow = millis() - ulTimeStart;
  if (ulTimeNow <= 4000) {
    setSpeedSignal(CAL_SIGNAL);
  }
  else {
    setSpeedSignal(TEST_SIGNAL);
  }
  //count loops
  ++loops;

  if(loops % 10000 == 0) {
    Serial.print("Loop: ");
    Serial.println(loops);
  }
  ulTimeNow = millis() - ulTimeStart;
  if(ulTimeNow >= 10000) {
    Serial.print("loops per second (loops/seconds): ");
    Serial.println(loops/ulTimeNow);
    while(1) {}
  }
}

void setSpeedSignal(unsigned short val) {
    motor.writeMicroseconds(val);
}

