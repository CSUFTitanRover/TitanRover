/*
 * authors: William Zschoche and Paul Ishizaki
 */

#include <Servo.h>
#include <PinChangeInt.h>

/*
 *  Input pins from X8R receiver
 */
#define JOINT1_IN_PIN 10  //ch. 7
#define JOINT2_IN_PIN 11  //ch. 6
#define WRIST_IN_PIN  12  //ch. 4
#define ENDE_IN_PIN   13  //ch. 3

/*
 *  Output pins to arm joints
 */
//valid PWM output pins(UNO): 3,5,6,9,10,11
#define AJNT1_OUT_PIN 3   //tape 1
#define AJNT2_OUT_PIN 5   //tape 2
#define WRIST_OUT_PIN 6   //tape 3
#define ENDE_OUT_PIN  9   //tape 4

/*
 *  Binary "flag" values for interrupts
 */

 #define JOINT1_FLAG 1
 #define JOINT2_FLAG 2
 #define WRIST_FLAG  4
 #define ENDE_FLAG   8

 /*
  *   Calibration signal for AJNT servo motors; 1500 = 0 output
  */
#define CENTER_SIGNAL 1500

//bit flag to indicate new sensor data has been written
volatile uint8_t bUpdateFlagsShared;

//raw sensor data
volatile uint16_t usAJNT1InShared;
volatile uint16_t usAJNT2InShared;
volatile uint16_t usWRISTInShared;
volatile uint16_t usENDEInShared;

//timestamp placeholder to for signal time length calcs
uint32_t ulAJNT1Start;
uint32_t ulAJNT2Start;
uint32_t ulWRISTStart;
uint32_t ulENDEStart;

////timer for cycle calculations
//uint32_t ulTimeStart;
//
////cycle counter
//uint32_t cycles;

Servo armJoint1;
Servo armJoint2;
Servo wristJoint;
Servo endeJoint;

void setup() {
  Serial.begin(9600);

  //attach output pins
  Serial.println("attaching pins...");
  armJoint1.attach(AJNT1_OUT_PIN);
  armJoint2.attach(AJNT2_OUT_PIN);
  wristJoint.attach(WRIST_OUT_PIN);
  endeJoint.attach(ENDE_OUT_PIN);

  //safety signal in case receiver does not receive data
  //extend arm straight out
  armJoint1.writeMicroseconds(CENTER_SIGNAL);
  armJoint2.writeMicroseconds(CENTER_SIGNAL);
  wristJoint.writeMicroseconds(CENTER_SIGNAL);
  endeJoint.writeMicroseconds(CENTER_SIGNAL);

  //attach interrupts
  Serial.println("attaching interrupts");
  PCintPort::attachInterrupt(JOINT1_IN_PIN, calcAJNT1, CHANGE);
  PCintPort::attachInterrupt(JOINT2_IN_PIN, calcAJNT2, CHANGE);
  PCintPort::attachInterrupt(WRIST_IN_PIN, calcWRIST, CHANGE);
  PCintPort::attachInterrupt(ENDE_IN_PIN, calcENDE, CHANGE);

//  //initialize timer
//  ulTimeStart = micros();
//
//  //initialize  cycle counter
//  cycles = 0;
  
  //sanity checker
  Serial.println("Done with Setup");
}


void loop() {
  
  static uint8_t bUpdateFlags;
  
  static uint16_t usAJNT1In;
  static uint16_t usAJNT2In;
  static uint16_t usWRISTIn;
  static uint16_t usENDEIn;

  static uint16_t usAJNT1;
  static uint16_t usAJNT2;
  static uint16_t usWRIST;
  static uint16_t usENDE;

  if (bUpdateFlagsShared)
  {
    //prevent writing from sensors to volatile vars
    noInterrupts();

    //grab values from volatile vars
    bUpdateFlags = bUpdateFlagsShared;

    if (bUpdateFlags & JOINT1_FLAG)
    {
      if(fabs(usAJNT1InShared - usAJNT1In) > 4)
      usAJNT1In = usAJNT1InShared;
    }
    if (bUpdateFlags & JOINT2_FLAG)
    {
      usAJNT2In = usAJNT2InShared;
    }
    if (bUpdateFlags & WRIST_FLAG)
    {
      usWRISTIn = usWRISTInShared;
    }
    if (bUpdateFlags & ENDE_FLAG)
    {
      usENDEIn = usENDEInShared;
    }

    //reset flag
    bUpdateFlagsShared = 0;

    //resume sensor writing
    interrupts();
  }

  //if flag values present (redundancy), scurb the new values for valid servo inputs
  if (bUpdateFlags & (JOINT1_FLAG || JOINT2_FLAG || WRIST_FLAG || ENDE_FLAG))
  {
    
    if (usAJNT1In < 1000)
      usAJNT1In = 1000;
    else if (usAJNT1In > 2000)
      usAJNT1In = 2000;
      
    if (usAJNT2In < 1000)
      usAJNT2In = 1000;
    else if (usAJNT2In > 2000)
      usAJNT2In = 2000;
      
    if (usWRISTIn < 1000)
      usWRISTIn = 1000;
    else if (usWRISTIn > 2000)
      usWRISTIn = 2000;

    if (usENDEIn < 1000)
      usENDEIn = 1000;
    else if (usENDEIn > 2000)
      usENDEIn = 2000;

    //map incoming values to allowable bounds
    //usAJNT1 = map(usAJNT1In, 1000, 2000, 1000, 2000);
    if(usAJNT1 != usAJNT1In)
      usAJNT1 = usAJNT1In;
      
    usAJNT2 = map(usAJNT2In, 1000, 2000, 1000, 2000);
    
    //NOTE:wrist locked to position for testing with shovel
    usWRIST = 1725;
    
    //NOTE:Shovel End Effector: Collision imminent with j1 when j2 is at_____ and
    //end effector is at 1820. Condition statements should prevent this.
    usENDE = map(usENDEIn, 1000, 2000, 1276, 1950);

    //Bound testing: print to console
    Serial.print("joint1: ");
    Serial.println(usAJNT1);
//    Serial.print("joint2: ");
//    Serial.println(usAJNT2);
//    Serial.print("wrist: ");
//    Serial.println(usWRIST);
//    Serial.print("ende: ");
//    Serial.println(usENDE);

    setSpeedJoint1(usAJNT1);
    setSpeedJoint2(usAJNT2);
    setSpeedWrist(usWRIST);
    setSpeedEnde(usENDE);

    bUpdateFlags = 0;
                
  }
  //delay(1000);

}

void setSpeedJoint1(uint16_t val)
{
  armJoint1.writeMicroseconds(val);
}

void setSpeedJoint2(uint16_t val)
{
  //Serial.println(val);
  armJoint2.writeMicroseconds(val);
}

void setSpeedWrist(uint16_t val)
{
  wristJoint.writeMicroseconds(val);
}

void setSpeedEnde(uint16_t val)
{
  endeJoint.writeMicroseconds(val);
}

void calcAJNT1()
{
  if (digitalRead(JOINT1_IN_PIN) == HIGH)
  {
    ulAJNT1Start = micros();  
  }
  else
  {
    usAJNT1InShared = (uint16_t)(micros() - ulAJNT1Start);
    bUpdateFlagsShared |= JOINT1_FLAG;
  }
}
void calcAJNT2()
{
  if (digitalRead(JOINT2_IN_PIN) == HIGH)
  {
    ulAJNT2Start = micros();
  }
  else
  {
    usAJNT2InShared = (uint16_t)(micros() - ulAJNT2Start);
    bUpdateFlagsShared |= JOINT2_FLAG;
  }
}
void calcWRIST()
{
  //Serial.println("WRIST IS READ");
  if (digitalRead(WRIST_IN_PIN) == HIGH)
  {
    ulWRISTStart = micros();  
  }
  else
  {
    usWRISTInShared = (uint16_t)(micros() - ulWRISTStart);
    bUpdateFlagsShared |= WRIST_FLAG;
  }
}
void calcENDE()
{
  //Serial.println("ENDE IS READ");
  if (digitalRead(ENDE_IN_PIN) == HIGH)
  {
    ulENDEStart = micros();  
  }
  else
  {
    usENDEInShared = (uint16_t)(micros() - ulENDEStart);
    bUpdateFlagsShared |= ENDE_FLAG;
  }
}
