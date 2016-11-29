/*
 * author:  Brandon Dang
 */

#include "PinChangeInt.h"
#include <math.h>
#include <Servo.h>

#define XCOORD 10
#define YCOORD 11

#define XCOORDFLAG 1
#define YCOORDFLAG 2
/*Calibration signal for AJNT servo motors; 1500 = 0 output
*/
#define CENTER_SIGNAL 1500
/*raw sensor data
*/
volatile uint16_t XINPUTSHARED;
volatile uint16_t YINPUTSHARED;
/*timestamp placeholder for signal time length calcs
*/
uint32_t XSTART;
uint32_t YSTART;

float XPOS;
float YPOS;

double length1 = 900;
double length2 = 1100;
double theta1;
double theta2;

/*Valid PWM Output pins to arm joints(UNO) : 3,5,6,9 
*/
#define AJNT1_OUT_PIN 3  //tape 1
#define AJNT2_OUT_PIN 5 //tape 2
/*define binary flag values for interrupt
*/
#define JOINT1_FLAG 1
#define JOINT2_FLAG 2
/*Calibration signal for AJNT servo motors; 1500 = 0 output
*/
#define CAL_SIGNAL 1500
/*Raw sensor data
*/
volatile uint16_t usAJNT1InShared;
volatile uint16_t usAJNT2InShared;
/*timestamp palceholder to for signal time length calcs
*/
uint32_t ulAJNT1Start;
uint32_t ulAJNT2Start;
/*Object declaration
*/
Servo armJoint1;
Servo armJoint2;

volatile uint8_t bUpdateFlagsShared;

void setup() {
  Serial.begin(9600);
  
  /*Attach output pins
  */
  Serial.println("attaching pins");
  armJoint1.attach(AJNT1_OUT_PIN);
  armJoint2.attach(AJNT2_OUT_PIN);
  /*Safety signal in case receiver does not receive data
  */
  armJoint1.writeMicroseconds(CENTER_SIGNAL);
  armJoint2.writeMicroseconds(CENTER_SIGNAL);
  
  Serial.println("attaching interrupts");
  PCintPort::attachInterrupt(XCOORD, calcXLocation, CHANGE);
  PCintPort::attachInterrupt(YCOORD, calcYLocation, CHANGE);
  
  Serial.println("Done with Setup");
  delay(10000);
}

  static uint16_t XCOORDIN;
  static uint16_t YCOORDIN;
  
  static uint8_t bUpdateFlags;
  
  /*Theta after converted from radians to degrees
  */
  int theta1Deg;
  int theta2Deg;
  
  static int usAJNT1In;
  static int usAJNT2In;
  static int usAJNT1;
  static int usAJNT2;
  
  bool initialized = false;

void loop() {
  /*put your main code here, to run repeatedly:
  */

  
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
    //reset flag
    bUpdateFlagsShared = 0;
    
    //resume sensor writing
    interrupts();
  }
   
  //if flag values present redundancy, scrub the new values for valid servo inputs
  if (bUpdateFlags & (XCOORDFLAG || YCOORDFLAG))
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
  }
  
  XPOS = map(XCOORDIN, 1000, 2000, 0, 2000);
  YPOS = map(YCOORDIN, 1000, 2000, 0, 2000);
  
  // Math Stuff
  theta1 = solveTheta1(XPOS, YPOS, length1, length2);
  theta2 = solveTheta2(XPOS, YPOS, length1, length2);
  
  if(!isnan(theta1) || !isnan(theta2))
   {
    //output Xcoordinate
    Serial.print(XPOS);
    Serial.print("\t");
    
    //output Ycoordinate
    Serial.print(YPOS);
    Serial.print("\t");
  
    //output theta1 in radian
    Serial.print(theta1);
    Serial.print("\t");
    //output theta2 in radian
    Serial.print(theta2);
    Serial.print("\t");
    
    //Convert to from Radians to Degrees
    theta1Deg = theta1*(180/PI);
    theta2Deg = theta2*(180/PI);
  
    //Output Degrees
    Serial.print(theta1Deg);
    Serial.print("\t");
    Serial.print(theta2Deg);
    Serial.print("\t");
    
    
    // Mapping Degrees to proper PWM SIGNAL, MODIFY THIS
    // Account for the fact that JOINT2 is still reversed
    if(theta1Deg >= -90 && theta1Deg <= 90 && theta2Deg >= -90 && theta2Deg <= 90)
    {
      usAJNT1 = map(theta1Deg, -90, 90, 1000, 2000);
      usAJNT2 = map(theta2Deg, -90, 90, 1000, 2000);
      //Converted Values that are inputs
      Serial.print(usAJNT1);
      Serial.print("\t");
      Serial.print(usAJNT2);
      setSpeedJoint1(usAJNT1);
      setSpeedJoint2(usAJNT2);
    }
    Serial.println("\t");
    
    //Will write value to the servo
    /*
    setSpeedJoint1(usAJNT1);
    setSpeedJoint2(usAJNT2);
    */
    bUpdateFlags = 0;
    initialized = true;
  }
  //else state exclusively for debugging
  else if(initialized)
  {
    Serial.println("******************************");
    Serial.println("DEBUG");
    //output Xcoordinate
    Serial.print(XPOS);
    Serial.print("\t");
    
    //output Ycoordinate
    Serial.print(YPOS);
    Serial.print("\t");
  
    //output theta1 in radian
    Serial.print(theta1);
    Serial.print("\t");
    //output theta2 in radian
    Serial.print(theta2);
    Serial.print("\t");
    
    Serial.print(theta1Deg);
    Serial.print("\t");
    Serial.print(theta2Deg);
    Serial.print("\t");
    
    if(theta1Deg >= -90 && theta1Deg <= 90 && theta2Deg >= -90 && theta2Deg <= 90)
    {
      //Converted Values that are inputs
      Serial.print(usAJNT1);
      Serial.print("\t");
      Serial.print(usAJNT2);
      setSpeedJoint1(usAJNT1);
      setSpeedJoint2(usAJNT2);
    }
    Serial.println("\t");
    Serial.println("******************************");
    delay(15000);
    
  }
  
  delay(100);
}


























void setSpeedJoint1(uint16_t val)
{
  armJoint1.writeMicroseconds(val);
}
void setSpeedJoint2(uint16_t val)
{
  armJoint2.writeMicroseconds(val);
}
double solveTheta1(double XPOS, double YPOS, double length1, double length2)
{
  double tempL1sq = pow(length1, 2);
  double tempL2sq = pow(length2, 2);
  double tempXsq = pow(XPOS, 2);
  double tempYsq = pow(YPOS, 2);
  
  double SquareRootInput =  tempXsq + tempYsq;
  double squareRoot = sqrt(SquareRootInput);
  double denominator = 2*length1*squareRoot;

  //double atan_calc;
  
  if(XPOS == 0)
    XPOS = 1;
  //if(YPOS == 0)
  //  atac_Calc = 0;
  //else
  //  atan_calc = atan(YPOS/XPOS);
  double tempTheta1 = atan(YPOS/XPOS) - acos((tempXsq + tempYsq + tempL1sq - tempL2sq)/(denominator));
    
  return tempTheta1;
  
}
double solveTheta2(double XPOS, double YPOS, double length1, double length2)
{
  double tempL1sq = pow(length1, 2);
  double tempL2sq = pow(length2, 2);
  double tempXsq = pow(XPOS, 2);
  double tempYsq = pow(YPOS, 2);
  
  double denominator = 2*length1*length2;
  
  double tempTheta2 = PI - acos((tempL1sq + tempL2sq - tempXsq - tempYsq)/(denominator));
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

