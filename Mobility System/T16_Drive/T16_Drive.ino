/*
    Project:        Titan Rover 2016
    Program:        Mobility System
    
    Version:        1.2
    
    Date Created:   11/20/2015

    Mobility Team:  William Zschoche
                    Paul Ishizaki
                    Justin Stewart

    Description:    Preliminary drive sketch directing Rover Mobility sub-system.
                    Single joystick control over of rover in differential steering
                    configuration.

                    Two PWM signal inputs are into -100, 100 cartesian coordinate
                    format. Calculations result in proportional power signals to
                    drive 4 to 6 electronic speed controller (ESCs).

                    Drive Mode is selected between 6-wheel drive and 4-wheel drive
                    by flipping the "SF" toggle switch on the upper left shoulder
                    of the Taranis radio controller.

                    Maximum throttle can be adjusted between 40% and 90% to suit
                    the situation.

                    **Note: 95% throttle will induce "1st and 2nd stage
                    punch-rate" and realize the remainder of the power curve of 
                    the speed controllers. DON'T DO IT! Modifying the maximum
                    throttle to allow for 100% WILL RISK DAMAGE TO TRMS, 
                    your soul, your puppy's soul, your puppy's puppies' souls, 
                    tear a hole in the spacetime, and call down the angels for 
                    the final battle against Adam and the rapture.
*/


#include <Servo.h>
#include <PinChangeInt.h>
#include <Math.h>
#include <T16_DiffAlg.h>

/*
 * Debug constant:  0 OFF
 *                  1 ON
 * Prints drive mode, maximum throttle, input, and output signals.
 */
#define DEBUG 0

/*
 * Performance constant:  0 OFF
 *                        1 ON
 * Displays loops per second, every second.
 */
#define PERFORMANCE 0

/*
     Input pins from EZ UHF 433MHz radio receiver.
*/
#define JLX_IN_PIN 7     //ch. 1
#define JLY_IN_PIN 8     //ch. 2
#define DRV_IN_PIN 12    //ch. 3
#define MTH_IN_PIN 4     //ch. 4

/*
    Output pins to ESCs.

    valid PWM output pins(MEGA 2560): 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                      44, 45, 46
*/

//Testing on UNO. Pins are different than above.
#define ESC_FL_OUT_PIN 3   //Front Left ESC
#define ESC_FR_OUT_PIN 9   //Front Right ESC
#define ESC_BL_OUT_PIN 5   //Back Left ESC
#define ESC_BR_OUT_PIN 6   //Back Right ESC
#define ESC_ML_OUT_PIN 10  //Mid Left ESC
#define ESC_MR_OUT_PIN 11   //Mid Right ESC

/*
    Binary "flag" values for interrupts.
*/
#define JLY_FLAG  1
#define JLX_FLAG  2
#define DRV_FLAG  4
#define MTH_FLAG  8

/*
    Calibration signal for ESCs; 1500 = 0 throttle.
*/
#define CAL_SIGNAL 1500

/*
    Signal limiting constants in T16_DiffAlg library. Maximum allowable signals for forward and
    reverse throttle are 50%

    Note: Throttle is further limited in ESC firmware profile TITAN_ROVER. to a maximum of 25%,
     50% in reverse.
*/

volatile uint8_t bUpdateFlagsShared;

volatile uint16_t uJLYInShared;
volatile uint16_t uJLXInShared;
volatile uint16_t uDRVInShared;
volatile uint16_t uMTHInShared;

uint32_t ulJLYStart;
uint32_t ulJLXStart;
uint32_t ulDRVStart;
uint32_t ulMTHStart;

uint32_t ulTimeStart;

uint32_t ulCheckStart;

//Variables for performance verifiers
uint32_t cycles;
uint32_t avgCycles;
uint32_t toESCs;

Servo motorFL;
Servo motorFR;
Servo motorBL;
Servo motorBR;
Servo motorML;
Servo motorMR;

T16_DiffAlg diff;

void setup() {
  //initialize Serial output
  Serial.begin(9600);

  Serial.println("Attaching output pins...");
  //attach output pins
  motorFL.attach(ESC_FL_OUT_PIN);
  motorFR.attach(ESC_FR_OUT_PIN);
  motorBL.attach(ESC_BL_OUT_PIN);
  motorBR.attach(ESC_BR_OUT_PIN);
  motorML.attach(ESC_ML_OUT_PIN);
  motorMR.attach(ESC_MR_OUT_PIN);

  Serial.println("Attaching interrupts...");
  PCintPort::attachInterrupt(JLY_IN_PIN, calcJLY, CHANGE);
  PCintPort::attachInterrupt(JLX_IN_PIN, calcJLX, CHANGE);
  PCintPort::attachInterrupt(DRV_IN_PIN, calcDRV, CHANGE);
  PCintPort::attachInterrupt(MTH_IN_PIN, calcMTH, CHANGE);

  //Initialize timer.
  ulTimeStart = micros();

  //Initialize Signal Checker timer.
  ulCheckStart = 0;

  //Ensure ESCs are calibrated by sending idle signal for a
  //minimum of 4 seconds.
  Serial.println("Calibrating...");
  do {
    setSpeedAll(CAL_SIGNAL);
  } while ((micros() - ulTimeStart) <= 4000000);
  
  Serial.println("Done calibrating.");
  
  Serial.println("Done with setup!");

  //Initiliaze loop counter and timer for performance test.
  if (PERFORMANCE) {
    ulTimeStart = micros();
    cycles = 0;
  }
}

void loop() {
  
  static uint8_t bUpdateFlags;

  static uint16_t uJLYIn;
  static uint16_t uJLXIn;
  static uint16_t uDRVIn;
  static uint16_t uMTHIn;

  static uint16_t uPowL;
  static uint16_t uPowR;

  static uint16_t uPower[2];

  if (bUpdateFlagsShared) {

    noInterrupts();

    bUpdateFlags = bUpdateFlagsShared;
    //check for y-input flag
    if (bUpdateFlags & JLY_FLAG) {
      uJLYIn = uJLYInShared;
    }
    //check for x-input flag
    if (bUpdateFlags & JLX_FLAG) {
      uJLXIn = uJLXInShared;
    }
    //check drive mode flag
    if (bUpdateFlags & DRV_FLAG) {
      uDRVIn = uDRVInShared;
    }
    //check max throttle flag
    if (bUpdateFlags & MTH_FLAG) {
      uMTHIn = uMTHInShared;
    }

    bUpdateFlagsShared = 0;
    
    interrupts();
  }

  if (bUpdateFlags & (JLX_FLAG || JLY_FLAG || MTH_FLAG)) {

      diff.setMaxThrottle(uMTHIn);
      diff.calcSpeed(uJLXIn, uJLYIn);

      uPowL = diff.getPowLeft();
      uPowR = diff.getPowRight();
  }

  /*
   * Signal Checker
   * If no new signals come for more than 1 second, fail to idle state.
   */
  if (bUpdateFlags == 0) {
    if(ulCheckStart == 0) ulCheckStart = micros();
    else {
      if(micros() - ulCheckStart >= 1000000) {
       uPowR = 1500;
       uPowL = 1500;
      }
    }
  }
  else ulCheckStart = 0;

  setSpeedRight(uPowR, uDRVIn);
  setSpeedLeft(uPowL, uDRVIn);

  bUpdateFlags = 0;
  
  if(PERFORMANCE) {
    ++cycles;
    if((micros() - ulTimeStart) >= (1000000)){
      printPerformanceData();
    }
  }

  if(DEBUG) {
    if((micros() - ulTimeStart) >= (1000000)){
      
      if(uDRVIn > 1500) Serial.println("DRV Mode: 6WD");
      else Serial.println("DRV Mode: 4WD");
      
      Serial.print("JOY Y: ");
      Serial.println(uJLYIn);
      
      Serial.print("JOY X: ");
      Serial.println(uJLXIn);
      
      Serial.print("MAX Thr: ");
      Serial.println(diff.getMaxThrottle());
      
      Serial.print("POW L: ");
      Serial.println(uPowL);
      
      Serial.print("POW R: ");
      Serial.println(uPowR);
      
      ulTimeStart = micros();
    }
  }
}

void setSpeedAll(uint16_t val) {
    motorBL.writeMicroseconds(val);
    motorBR.writeMicroseconds(val);
    motorML.writeMicroseconds(val);
    motorMR.writeMicroseconds(val);
    motorFL.writeMicroseconds(val);
    motorFR.writeMicroseconds(val);
}

void setSpeedLeft(uint16_t val, uint16_t mode) {
  //6WD mode
  if (mode > 1500) {
    motorBL.writeMicroseconds(val);
    motorML.writeMicroseconds(val);
    motorFL.writeMicroseconds(val);
  }
  //4WD mode
  else {
    motorFL.writeMicroseconds(val);
    motorBL.writeMicroseconds(val);
  }
}

void setSpeedRight(uint16_t val, uint16_t mode) {
  //6WD mode
  if (mode > 1500) {
    motorBR.writeMicroseconds(val);
    motorMR.writeMicroseconds(val);
    motorFR.writeMicroseconds(val);
  }
  //4WD mode
  else {
    motorFR.writeMicroseconds(val);
    motorBR.writeMicroseconds(val);
  }
}

// Calculate pulse time for the y-axis of the left joystick.
void calcJLY() {
  if (digitalRead(JLY_IN_PIN) == HIGH)
  {
    ulJLYStart = micros();
  }
  else
  {
    uJLYInShared = (uint16_t)(micros() - ulJLYStart);
    bUpdateFlagsShared |= JLY_FLAG;
  }
}

// Calculate pulse time for the x-axis of the left joystick.
void calcJLX()
{
  if (digitalRead(JLX_IN_PIN) == HIGH)
  {
    ulJLXStart = micros();
  }
  else
  {
    uJLXInShared = (uint16_t)(micros() - ulJLXStart);
    bUpdateFlagsShared |= JLX_FLAG;
  }
}

// Calculate pulse time for the drive mode switch.
void calcDRV()
{
  if (digitalRead(DRV_IN_PIN) == HIGH)
  {
    ulDRVStart = micros();
  }
  else
  {
    uDRVInShared = (uint16_t)(micros() - ulDRVStart);
    bUpdateFlagsShared |= DRV_FLAG;
  }
}

// Calculate pulse time for the Max Throttle potentiometer.
void calcMTH()
{
  if (digitalRead(MTH_IN_PIN) == HIGH)
  {
    ulMTHStart = micros();
  }
  else
  {
    uMTHInShared = (uint16_t)(micros() - ulMTHStart);
    bUpdateFlagsShared |= MTH_FLAG;
  }
}

void printPerformanceData() {
  Serial.print("LPS: ");
  Serial.println(cycles);
  Serial.print("AVG LPS: ");
  Serial.println(avgCycles);
  Serial.print("ESC Writes:");
  cycles = 0;
  ulTimeStart = micros();
}

