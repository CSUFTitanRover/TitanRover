/*
 *  Project:        Titan Rover 2016
 *  Program:        Drive Program
 *  Date Created:   10/21/2015
 *  
 *  Mobility Team:  William Zschoche
 *                  Paul Ishizaki
 *                  Justin Stewart
 *                  Bastian Awischus
 *                  
 *  Description:    Preliminary drive sketch directing Rover Mobility sub-system.
 *                  Single joystick control over of rover in differential steering
 *                  configuration.
 *                  
 *                  Two PWM signal inputs are into -100, 100 cartesian coordinate
 *                  format. Calculations result in proportional power signals to
 *                  drive 4 to 6 electronic speed controller (ESCs).
 */


#include <Servo.h>
#include <PinChangeInt.h>
#include <Math.h>

/*  
 *   Input pins from X8R radio receiver.
 */
#define JLX_IN_PIN 10     //ch. 1
#define JLY_IN_PIN 11     //ch. 2

/*
 *  Output pins to ESCs.

    valid PWM output pins(MEGA 2560): 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                      44, 45, 46
*/
#define ESCFL_OUT_PIN 2   //Front Left ESC
#define ESCFR_OUT_PIN 3   //Front Right ESC
#define ESCBL_OUT_PIN 4   //Back Left ESC
#define ESCBR_OUT_PIN 5   //Back Right ESC

/*
 *  Binary "flag" values for interrupts.
 */
#define JLY_FLAG 2
#define JLX_FLAG 1

/*
 *  Calibration signal for ESCs; 1500 = 0 throttle.
 */
#define CAL_SIGNAL 1500

/*
 *  Signal limiting constants. Maximum allowable signals for forward and
 *  reverse throttle.
 *  
 *  Note: Throttle is further limited in ESC firmware profile TITAN_ROVER. to a maximum of 25%.
 *        
 */
#define MAX_FWD 1750      //Max forward throttle
#define MAX_REV 1250      //Max reverse throttle

/*
 *  
 */
volatile uint8_t bUpdateFlagsShared;

volatile uint16_t usJLYInShared;
volatile uint16_t usJLXInShared;

uint32_t ulJLYStart;
uint32_t ulJLXStart;

uint32_t ulTimeStart;

uint32_t cycles;

float x_coord;
float y_coord;

Servo motorFL;
Servo motorFR;
Servo motorBL;
Servo motorBR;

void setup() {
  //initialize Serial output
  Serial.begin(9600);

  Serial.println("attaching pins...");
  //attach output pins
  motorFL.attach(ESCFL_OUT_PIN);
  motorFR.attach(ESCFR_OUT_PIN);
  motorBL.attach(ESCBL_OUT_PIN);
  motorBR.attach(ESCBR_OUT_PIN);

  Serial.println("attaching interrupts");
  PCintPort::attachInterrupt(JLY_IN_PIN, calcJLY, CHANGE);
  PCintPort::attachInterrupt(JLX_IN_PIN, calcJLX, CHANGE);

  ulTimeStart = micros();
  Serial.println("Calibrating...");
  do {
    setSpeedAll(CAL_SIGNAL);
  } while((micros() - ulTimeStart) <= 4000000);
  Serial.println("Done Calibrating");

  //initialize timer
  ulTimeStart = micros();

  //initiliaze cycle counter
  cycles = 0;
  Serial.println("Done with setup");
}

void loop() {
  static uint8_t bUpdateFlags;
  
  static uint16_t usJLYIn;
  static uint16_t usJLXIn;

  static uint16_t usPowL;
  static uint16_t usPowR;

  float propL;
  float propR;

  float v;
  float w;
  
  //Ensure ESCs are calibrated by sending idles signal for a
  //minimum of 4 seconds.
  
  if(bUpdateFlagsShared) {
    
    noInterrupts();
    
    bUpdateFlags = bUpdateFlagsShared;
    //check for y-input interrupt
    if(bUpdateFlags & JLY_FLAG) {
      usJLYIn = usJLYInShared;
    }
    //check for x-input interrupt
    if(bUpdateFlags & JLX_FLAG) {
      usJLXIn = usJLXInShared;
    }
    
    bUpdateFlagsShared = 0;
    
    interrupts();
  }
  
  if(bUpdateFlags & (JLX_FLAG || JLY_FLAG)) {
    Serial.println("x-flag and y-flag");

    if(usJLXIn < 1000) {
        usJLXIn = 1000;
    }
    else if(usJLXIn > 2000) {
      usJLXIn = 2000;
    }
    if(usJLYIn < 1000) {
        usJLYIn = 1000;
    }
    else if(usJLYIn > 2000) {
        usJLYIn = 2000;
    }
    //usJLYIn = map(usJLXIn, 1000, 2000, 1150, 1850);
    x_coord = map(usJLXIn, 1000, 2000, -100, 100);
    y_coord = map(usJLYIn, 1000, 2000, -100, 100);

//    Serial.print("x-coord: ");
//    Serial.println(x_coord);
    if (fabs(x_coord) < 10)
      x_coord = 0;
    if (fabs(y_coord) < 10)
        y_coord = 0;

    //invert x_coord here?
    x_coord *= -1;
    
    v = calcPosVar(x_coord, y_coord);

    w = calcNegVar(x_coord, y_coord);

    propR = calcRightPower(v, w);

    propL = calcLeftPower(v, w);

    if(propR < 0) {
      usPowR = 1500 - ((1500 - MAX_REV)*(fabs(propR)/100));      
    }
    else {
      usPowR = 1500 + ((MAX_FWD - 1500)*(propR/100));
    }

    if(propL < 0) {
      usPowL = 1500 - ((1500 - MAX_REV)*(fabs(propL)/100));      
    }
    else {
      usPowL = 1500 + ((MAX_FWD - 1500)*(propL/100));
    }
  }

  Serial.print("wheels right: ");
  Serial.println(usPowR);
  Serial.print("wheels left: ");
  Serial.println(usPowL);

  setSpeedRight(usPowR);
  setSpeedLeft(usPowL);
  //Serial.println(usJLXIn);
    
  bUpdateFlags = 0;
  
  //count cycles
  ++cycles;

  if(cycles % 1000 == 0) {
  //Serial.print("Loops: ");
  //Serial.println(cycles);
  }
  Serial.print("y-coord: ");
  Serial.println(y_coord);
  Serial.print("x-coord: ");
  Serial.println(x_coord);
  Serial.println("\n");
  //delay(1000);
}

float calcPosVar(float x, float y) {
  return (100-fabs(x))*(y/100)+y;
}

float calcNegVar(float x, float y) {
  return (100-fabs(y))*(x/100)+x;
}

float calcRightPower(float v, float w) {
  return (v+w)/2;
}

float calcLeftPower(float v, float w) {
  return (v-w)/2;
}

void setSpeedAll(uint16_t val) {
  motorFL.writeMicroseconds(val);
  motorFR.writeMicroseconds(val);
  motorBL.writeMicroseconds(val);
  motorBR.writeMicroseconds(val);
}

void setSpeedLeft(uint16_t val) {
  motorFL.writeMicroseconds(val);
  motorBL.writeMicroseconds(val);
}

void setSpeedRight(uint16_t val) {
  motorFR.writeMicroseconds(val);
  motorBR.writeMicroseconds(val);
  Serial.println(motorBR.readMicroseconds());
}

// Calculate 
void calcJLY() {
  if(digitalRead(JLY_IN_PIN) == HIGH)
  { 
    ulJLYStart = micros();
  }
  else
  {
    usJLYInShared = (uint16_t)(micros() - ulJLYStart);
    bUpdateFlagsShared |= JLY_FLAG;
  }
}

void calcJLX()
{
  if(digitalRead(JLX_IN_PIN) == HIGH)
  { 
    ulJLXStart = micros();
  }
  else
  {
    usJLXInShared = (uint16_t)(micros() - ulJLXStart);
    bUpdateFlagsShared |= JLX_FLAG;
  }
}
