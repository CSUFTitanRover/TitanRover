#include "PinChangeInt.h"
#include <math.h>
#include <Servo.h>

/*x is channel 1, y is channel 2
*/
#define XCOORD 11
#define YCOORD 10

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
float phiE;

double length1 = 900;
double length2 = 1050;
double length3 = 350;
double theta1;
double theta2;
double theta3;

/*Valid PWM Output pins to arm joints(UNO) : 3,5,6,9
*/
#define AJNT1_OUT_PIN 3   //tape 1
#define AJNT2_OUT_PIN 5   //tape 2
#define ENDE_OUT_PIN 9    //tape 4
/*define binary flag values for interrupt
*/
#define JOINT1_FLAG 1
#define JOINT2_FLAG 2

/*Raw sensor data
*/
Servo armJoint1;
Servo armJoint2;
Servo endeJoint;

volatile uint8_t bUpdateFlagsShared;

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
  armJoint1.writeMicroseconds(CENTER_SIGNAL);
  armJoint2.writeMicroseconds(CENTER_SIGNAL);
  endeJoint.writeMicroseconds(ENDE_SIGNAL);

  Serial.println("attaching interrupts");
  PCintPort::attachInterrupt(XCOORD, calcXLocation, CHANGE);
  PCintPort::attachInterrupt(YCOORD, calcYLocation, CHANGE);

  xEndEPos = 1050;
  yEndEPos = 1600;
  phiE = 0;
  
  Serial.println("Done with Setup");
  delay(500);
}












void loop() {
  /*put your main code here, to run repeatedly:
  */
  static uint16_t XCOORDIN;
  static uint16_t YCOORDIN;

  static uint8_t bUpdateFlags;

  /*Theta after converted from radians to degrees
  */
  int theta1Deg;
  int theta2Deg;
  int theta3Deg;
  
  double xWristPos;
  double yWristPos;
  
  static int usAJNT1;
  static int usAJNT2;
  static int usENDE;
  
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

  if(YCOORDIN > 1750)
  {
    yEndEPos = yEndEPos + 50;  
  }
  else if(YCOORDIN < 1250)
  {
    yEndEPos = yEndEPos - 50;  
  }
  else if(yEndEPos <= -2300)
  {
    yEndEPos = -2300;  
  }
  else if(yEndEPos >= 2300)
  {
    yEndEPos = 2300;  
  }

  if(XCOORDIN > 1750)
  {
    xEndEPos = xEndEPos + 50;
  }
  else if(XCOORDIN < 1250)
  {
    xEndEPos = xEndEPos - 50;  
  }
  else if(xEndEPos <= -2300)
  {
    xEndEPos = -2300;  
  }
  else if(xEndEPos >= 2300)
  {
    xEndEPos = 2300;  
  }
  
  xWristPos = solveXWrist(xEndEPos);
  yWristPos = solveYWrist(yEndEPos);
  
  // Math Stuff, these are radians
  theta1 = solveTheta1(xWristPos, yWristPos, length1, length2);
  theta2 = solveTheta2(xWristPos, yWristPos, length1, length2);
  theta3 = solveTheta3(phiE, theta1, theta2);
  
  //Convert to from Radians to Degrees
  theta1Deg = theta1 * (180 / PI);
  theta2Deg = theta2 * (180 / PI);
  theta3Deg = theta3 * (180 / PI);
 
//  if (!isnan(theta1) || !isnan(theta2))
//  {
    // Mapping Degrees to proper PWM SIGNAL, MODIFY THIS
    // Account for the fact that JOINT2 is still reversed
    if (theta1Deg >= -170 && theta1Deg <= 170 && theta2Deg >= -170 && theta2Deg <= 170 && theta3Deg >= -170 && theta3Deg <= 170)
    {
      usAJNT1 = map(theta1Deg, -180, 180, 1000, 2000);
      usAJNT2 = map(theta2Deg, -180, 180, 1000, 2000);
      usENDE = map(theta3Deg, -180, 180, 1400, 1800);
      //Converted Values that are inputs
      setSpeedJoint1(usAJNT1);
      /*
       * Since Joint 2 is mounted backwards, we need to reverse mirror the 
       * value so that Joint 1 and Joint 2 are Oriented in the same way
       * For example, a PWM signal of 1200 going to Joint 2 needs to be 
       * coverted to 1800 as neutral PWM signal is 1500.
       */
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
      setSpeedEndE(usENDE);
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
    //output theta3 in radian
    Serial.print(theta3);
    Serial.print(" rad");
    Serial.print("\t");

    //Output Degrees for thetas 1 2 3
    Serial.print(theta1Deg);
    Serial.print(" deg");
    Serial.print("\t");
    Serial.print(theta2Deg);
    Serial.print(" deg");
    Serial.print("\t");
    Serial.print(theta3Deg);
    Serial.print(" deg");
    Serial.print("\t");
    
    Serial.print(usAJNT1);
    Serial.print(" PWM");
    Serial.print("\t");
    Serial.print(usAJNT2);
    Serial.print(" PWM");
    Serial.print("\t");
    Serial.print(usENDE);
    Serial.print(" PWM");
    Serial.println("\t");

    //Will write value to the servo
    /*
    setSpeedJoint1(usAJNT1);
    setSpeedJoint2(usAJNT2);
    */
    bUpdateFlags = 0;
//  }
  delay(250);
}


























void setSpeedJoint1(uint16_t val)
{
  armJoint1.writeMicroseconds(val);
}
void setSpeedJoint2(uint16_t val)
{
  armJoint2.writeMicroseconds(val);
}
void setSpeedEndE(uint16_t val)
{
  endeJoint.writeMicroseconds(val);
}
double solveTheta1(double XPOS, double YPOS, double length1, double length2)
{
  double tempL1sq = pow(length1, 2);
  double tempL2sq = pow(length2, 2);
  double tempXsq = pow(XPOS, 2);
  double tempYsq = pow(YPOS, 2);

  double SquareRootInput =  tempXsq + tempYsq;
  double squareRoot = sqrt(SquareRootInput);
  double denominator = 2 * length1 * squareRoot;

  //double atan_calc;

  if (XPOS == 0)
    XPOS = 1;
  //if(YPOS == 0)
  //  atac_Calc = 0;
  //else
  //  atan_calc = atan(YPOS/XPOS);
  double tempTheta1 = atan2(YPOS,XPOS) - acos((tempXsq + tempYsq + tempL1sq - tempL2sq) / (denominator));

  return tempTheta1;
}
double solveTheta2(double XPOS, double YPOS, double length1, double length2)
{
  double tempL1sq = pow(length1, 2);
  double tempL2sq = pow(length2, 2);
  double tempXsq = pow(XPOS, 2);
  double tempYsq = pow(YPOS, 2);

  double denominator = 2 * length1 * length2;

  double tempTheta2 = PI - acos((tempL1sq + tempL2sq - tempXsq - tempYsq) / (denominator));
  return tempTheta2;
}
double solveTheta3(double tempPhiE, double tempTheta1, double tempTheta2)
{
  double tempTheta3;
  tempTheta3 = tempPhiE - tempTheta1 - tempTheta2;
  return tempTheta3;
}
double solveXWrist(double xVal)
{
  double XW;
  XW = xVal - length3*cos(phiE);
  return XW;  
}
double solveYWrist(double yVal)
{
  double YW;
  YW = yVal - length3*sin(phiE);
  return YW;
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
