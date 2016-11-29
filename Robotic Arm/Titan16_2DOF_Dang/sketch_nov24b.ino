/*
 * 2 DOF CODE
 */

#include "PinChangeInt.h"
#include <math.h>
#include <Servo.h>

/*x is channel 1, y is channel 2
*/
#define XCOORD 11
#define YCOORD 10
#define ENDE_IN_PIN 12

#define XCOORDFLAG 1
#define YCOORDFLAG 2   

/*Calibration signal for AJNT servo motors; 1500 = 0 output
*/
#define CENTER_SIGNAL 1500
#define ENDE_SIGNAL 1615
/*raw sensor data
*/
volatile uint16_t XINPUTSHARED;
volatile uint16_t YINPUTSHARED;
/*timestamp placeholder for signal time length calcs
*/
uint32_t XSTART;
uint32_t YSTART;

float xEndEPos;
float yEndEPos;
double linkage;
double gamma;

double length1 = 900;
double length2 = 1400;

double theta1;
double theta2;

/*Valid PWM Output pins to arm joints(UNO) : 3,5,6,9
*/
#define AJNT1_OUT_PIN 3   //tape 1
#define AJNT2_OUT_PIN 5   //tape 2
#define ENDE_OUT_PIN 9 //tape 4
/*define binary flag values for interrupt
*/

#define ENDE_FLAG 8

volatile uint8_t bUpdateFlagsShared;

volatile uint16_t usENDEInShared;

uint32_t ulENDEStart;

uint32_t u1ENDEStart;

float ende;

/*Raw sensor data
*/
Servo armJoint1;
Servo armJoint2;
Servo endeJoint;


void setup() {
  Serial.begin(9600);

  /*Attach output pins
  */
  Serial.println("attaching pins");
  armJoint1.attach(AJNT1_OUT_PIN);
  armJoint2.attach(AJNT2_OUT_PIN);
  endeJoint.attach(ENDE_OUT_PIN);
  /*Safety signal in case receiver does not receive data
  */
  //armJoint1.writeMicroseconds(CENTER_SIGNAL);
  //armJoint2.writeMicroseconds(CENTER_SIGNAL);
  endeJoint.writeMicroseconds(ENDE_SIGNAL);
  Serial.println("attaching interrupts");
  
  PCintPort::attachInterrupt(XCOORD, calcXLocation, CHANGE);
  PCintPort::attachInterrupt(YCOORD, calcYLocation, CHANGE);
  PCintPort::attachInterrupt(ENDE_IN_PIN, calcENDE, CHANGE);

  xEndEPos = 1050;
  yEndEPos = 1600;

  Serial.println("Done with Setup");
  delay(10000);
}



void loop() {
  /*put your main code here, to run repeatedly:
  */
  static uint16_t XCOORDIN;
  static uint16_t YCOORDIN;

  static uint16_t usENDEIn;

  //static uint16_t usENDE;

  static uint8_t bUpdateFlags;

  /*Theta after converted from radians to degrees
  */
  int theta1Deg;
  int theta2Deg;
  
  static int usAJNT1;
  static int usAJNT2;
  
  if (bUpdateFlagsShared)
  {
    //prevent writing from sensors to volatile vars
    noInterrupts();

    //grab values from volatile vars
    bUpdateFlags = bUpdateFlagsShared;

    if (bUpdateFlags & XCOORDFLAG)
    {
      XCOORDIN = XINPUTSHARED;
    }
    if (bUpdateFlags & YCOORDFLAG)
    {
      YCOORDIN = YINPUTSHARED;
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

  //if flag values present redundancy, scrub the new values for valid servo inputs
  if (bUpdateFlags & (XCOORDFLAG || YCOORDFLAG || ENDE_FLAG))
  {
    if (XCOORDIN < 1000)
    {
      XCOORDIN = 1000;
    }
    else if (XCOORDIN > 2000)
    {
      XCOORDIN = 2000;
    }

    if (YCOORDIN < 1000)
    {
      YCOORDIN = 1000;
    }
    else if (YCOORDIN > 2000)
    {
      YCOORDIN = 2000;
    }

    if (usENDEIn < 1000)
    {
      usENDEIn = 1000;
    }
    else if (usENDEIn > 2000)
    {
      usENDEIn = 2000;
    }
  }

  if(YCOORDIN > 1750)
  {
    yEndEPos = yEndEPos + 50;  
  }
  else if(YCOORDIN < 1250)
  {
    yEndEPos = yEndEPos - 50;  
  }
  else if(yEndEPos <= -2000)
  {
    yEndEPos = -2000;  
  }
  else if(yEndEPos >= 2000)
  {
    yEndEPos = 2000;  
  }

  if(XCOORDIN > 1750)
  {
    xEndEPos = xEndEPos + 50;
  }
  else if(XCOORDIN < 1250)
  {
    xEndEPos = xEndEPos - 50;  
  }
  else if(xEndEPos <= -2000)
  {
    xEndEPos = -2000;  
  }
  else if(xEndEPos >= 2000)
  {
    xEndEPos = 2000;  
  }

/*
 *  Shovel End Effector: Collision imminent with j1 when j2 is at_____ and
 *  end effector is at 1820. Conditions should prefent this.
 */
  ende = map(usENDEIn, 1000, 2000, 1276, 1950);
  
  setSpeedEnde(ende);
   
  // Math Stuff, these are radians
  linkage = solveLinkage(xEndEPos, yEndEPos);
  gamma = solveGamma(length1, length2, linkage);
  theta1 = solveTheta1(gamma, xEndEPos, yEndEPos);
  theta2 = solveTheta2(theta1, length1, xEndEPos, yEndEPos);
  
  //Convert to from Radians to Degrees
  theta1Deg = theta1 * (180 / PI);
  theta2Deg = theta2 * (180 / PI);
 
//  if (!isnan(theta1) || !isnan(theta2))
//  {
    // Mapping Degrees to proper PWM SIGNAL, MODIFY THIS
    // Account for the fact that JOINT2 is still reversed
    if (theta1Deg >= -170 && theta1Deg <= 170 && theta2Deg >= -170 && theta2Deg <= 170)
    {
      usAJNT1 = map(theta1Deg, -180, 180, 1000, 2000);
      usAJNT2 = map(theta2Deg, -180, 180, 1000, 2000);
      
      //Converted Values that are inputs
      setSpeedJoint1(usAJNT1);
      if(usAJNT2 == 1500)
      {
        setSpeedJoint2(usAJNT2);  
      }
      else if(usAJNT2 > 1500)
      {
        setSpeedJoint2(1500 - (usAJNT2 - 1500));
      }
      else if(usAJNT2 < 1500)
      {
        setSpeedJoint2(1500 + (1500 - usAJNT2)); 
      }
      
    }
    //output Xcoordinate of End Effector
    Serial.print(xEndEPos);
    Serial.print(" pos");
    Serial.print("\t");

    //output Ycoordinate of End Effector
    Serial.print(yEndEPos);
    Serial.print(" pos");
    Serial.print("\t");

    //output theta1 in radian
    Serial.print(theta1);
    Serial.print(" rad");
    Serial.print("\t");
    //output theta2 in radian
    Serial.print(theta2);
    Serial.print(" rad");
    Serial.print("\t");

    //Output Degrees for thetas 1 2 3
    Serial.print(theta1Deg);
    Serial.print(" deg");
    Serial.print("\t");
    Serial.print(theta2Deg);
    Serial.print(" deg");
    Serial.print("\t");
    //PWM Signals 
    
    Serial.print(usAJNT1);
    Serial.print(" PWM");
    Serial.print("\t");
    Serial.print(usAJNT2);
    Serial.print(" PWM");
    Serial.print("\t");

    Serial.print(ende);
    Serial.print(" end");
    Serial.println("\t");
  
    
  //Will write value to the servo
    /*
    setSpeedJoint1(usAJNT1);
    setSpeedJoint2(usAJNT2);
    */
    bUpdateFlags = 0;
//  }
  //delay(1000);
}


























void setSpeedJoint1(uint16_t val)
{
  armJoint1.writeMicroseconds(val);
}
void setSpeedJoint2(uint16_t val)
{
  armJoint2.writeMicroseconds(val);
}
void setSpeedEnde(uint16_t val)
{
  endeJoint.writeMicroseconds(val);
}
double solveLinkage(double XPOS, double YPOS)
{
  double tempLinkage;
  double squareInput = XPOS*XPOS + YPOS*YPOS;
  tempLinkage = sqrt(squareInput);
  
  return tempLinkage;
}
double solveGamma(double tempLength1, double tempLength2, double linkage)
{
  double tempGamma;
  
  double numerator = (linkage*linkage) + (length1*length1) - (length2*length2);
  double denominator = (2*length1*linkage);

  tempGamma = acos(numerator/denominator);
  return tempGamma;
}
double solveTheta1(double tempGamma, double tempXEndEPos, double tempYEndEPos)
{
  double tempTheta1 = atan2(tempYEndEPos,tempXEndEPos) - gamma;
  
  return tempTheta1;
}
double solveTheta2(double tempTheta1, double tempLength1, double tempXEndEPos, double tempYEndEPos)
{
  double tempTheta2;
  double numerator = tempYEndEPos - tempLength1*sin(tempTheta1);
  double denominator = tempXEndEPos - tempLength1*cos(tempTheta1);

  tempTheta2 = atan2(numerator,denominator) - tempTheta1;
  
  return tempTheta2;
}
void calcXLocation()
{
  if (digitalRead(XCOORD) == HIGH)
  {
    XSTART = micros();
  }
  else
  {
    XINPUTSHARED = (uint16_t)(micros() - XSTART);
    bUpdateFlagsShared |= XCOORDFLAG;
  }
}
void calcYLocation()
{
  if (digitalRead(YCOORD) == HIGH)
  {
    YSTART = micros();
  }
  else
  {
    YINPUTSHARED = (uint16_t)(micros() - YSTART);
    bUpdateFlagsShared |= YCOORDFLAG;
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

