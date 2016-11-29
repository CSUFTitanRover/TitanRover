

import com.leapmotion.leap.*;
import processing.net.*;
import hypermedia.net.*;

final float LENGTH1 = 1000;//900.0;//1025;
final float LENGTH2 = 800;//1050.0;//950;

//final String IP = "192.168.1.109";
//final String IP = "169.254.85.22";
final String IP = "192.168.1.20";
//final String IP = "192.168.1.101";
final int PORT = 8888;

final int ROVER_X = 550;
final int ROVER_Y = 400;
final int ROVER_WIDTH = 200;
final int ROVER_LENGTH = 100;

final int LEG_X = 575;
final int LEG_Y = 500;
final int LEG_WIDTH = 20;
final int LEG_LENGTH = 60;
final int LEG_SHIFT_RIGHT = 70;

final int WHEEL_X = 585;
final int WHEEL_Y = 570;
final int WHEEL_DIAMETER = 60;
final int WHEEL_SHIFT_RIGHT = 70;

final int JOINT1_X_ORIGIN = 750;
final int JOINT1_Y_ORIGIN = 400;

final int JOINT1_RESET = 1700;
final int JOINT2_RESET = 1700;

int joint2X;
int joint2Y;

int endeX;
int endeY;
final int ENDE_DIAMETER = 10;

static int pastJoint2X;
static int pastJoint2Y;
static int pastEndeX;
static int pastEndeY;

float xArm;
float yArm;
float wrist = 1500;
float gripper = 1500;

static float pastX;
static float pastY;
static float pastWrist;
static float pastGripper;

float theta1;
float theta2;
float theta1Deg;
float theta2Deg;

static float pastTheta1;
static float pastTheta2;

float joint1PWM = JOINT1_RESET;
float joint2PWM = JOINT2_RESET;

static float pastJoint1PWM;
static float pastJoint2PWM;

boolean wristCW = false;
boolean wristCCW = false;
int wristOrientation = 0;

int shoulderOrientation = 0;
int lazySusanOrientation = 0;

boolean firstLoopCycle = true;
boolean oneToOneSlow = true;
int oneToOneSlowIncrementFactor = 3;

boolean  joint1Increment = false;
boolean  joint1Decrement = false;
boolean  joint2Increment = false;
boolean  joint2Decrement = false;

boolean  wrist_gripper_mode = false;
boolean  wristOnline = false;
boolean  gripperOnline = false;

boolean  reset = false;

UDP udp;

Client arm;
Controller leap;
boolean work = false;

void setup()
{
  udp = new UDP(this, 6000);
  udp.listen(true);
  
  frameRate(10);
  
  joint2X = 850;
  joint2Y = 350;
  endeX = 900;
  endeY = 250;
  
  size(1000,600);
  leap = new Controller();
}

double cba(double a)
{
  float n = 100 * 3;
  a = 1.5 + 2 * a / n;
  double angle = 90 + Math.cos(a) * 90;
  return angle;
}

void draw()
{
  /***********************************************
  
      Leap Motion Calculations
      
  ************************************************/
  
  HandList hands = leap.frame().hands();
  Hand handR = hands.get(0);
  Hand handL = hands.get(1);
  FingerList fingersR = handR.fingers();
  FingerList fingersL = handL.fingers();
  Vector hpR = handR.palmPosition();
  Vector hpL = handL.palmPosition();
  
  Pointable f1R = fingersR.get(2);
  Pointable f2R = fingersR.get(3);
  
  Pointable f1L = fingersL.get(0);
  Pointable f2L = fingersL.get(1);
  
  float ff1 = f1R.tipPosition().getX();
  float ff2 = f2R.tipPosition().getX();
  float sub = ff1 - ff2;
  
  float ff1L = f1L.tipPosition().getX();
  
  float pitchR = handR.direction().pitch() * 100;
  float rollR = handR.direction().roll() * 100;
  rollR = map(rollR, -300, 400, 100, 0);
  //if (rollR < 0) rollR *= -1;
  //rollR = map(rollR, -300, 400, 100, 0);


  if(hpR.getY() < 150)  hpR.setY(150);
  if(hpR.getY() > 445)  hpR.setY(445);
  if(hpR.getZ() < -180) hpR.setZ(-180);
  if(hpR.getZ() > 180)  hpR.setZ(180);
  
  float zv = map(hpR.getZ(), -180, 180, 101, 1);
  float yv = map(hpR.getY(), 150, 445, 1, 101);
  
  double xv = 180 - cba(-handR.palmPosition().getX() / 1.5);
  
  float pv = map(pitchR, -90, 100, 160, 6);
  float gv = map(sub, 20, 90, 145, 73);
  
  if (fingersR.count() >= 2) work = true;
  else work = false;
  
  //if (work && zv <= 180 && zv >= 0 && yv <= 150 && yv >= 0 && xv <= 180 && xv >= 0 && pv >= 6 && gv <= 145 && gv >= 73)
  //{
  //  String v1 = (int)xv + "P";
  //  String v2 = (int)zv + "Q";
  //  String v3 = (int)yv + "F";
  //  String v4 = (int)pv + "K";
  //  String v5 = (int)gv + "L";
  //}
  
  /***********************************************
  
      Inverse Kinematic Calculations
      
  ************************************************/ 

  yArm = map(int(yv), 1, 101, -1800, 1800);
  xArm = map((int)zv, 1, 101, -1800, 1800);
  //wrist = map((int)pv, -30, 200, 1000, 2000);
  endeY = (int)map(yArm, -1800, 1800, 600, 200);
  endeX = (int)map(xArm, -1800, 1800, 500, 1000);
  //if (gv < 160)
  //  gv = 160;
  //else if (gv > 320)
  //  gv = 320;
  //gripper = map((int)gv, 160, 320, 1, 101);
  //wrist = checkPWMBounds(wrist);
  wristCW = false;
  wristCCW = false;
  
  if (firstLoopCycle)
  {
    pastY = yArm;
    pastX = xArm;
    pastWrist = wrist;
    theta1 = PI/2;
    theta2 = PI/2;
    pastTheta1 = theta1;
    pastTheta2 = theta2;
    pastEndeY = endeY;
    pastEndeX = endeX;
    pastJoint2Y = 0;
    pastJoint2Y = 0;
    pastGripper = gripper;
  }
  if (reset)
  {
    joint1PWM = JOINT1_RESET;
    joint2PWM = JOINT2_RESET;
  }
  else if (wrist_gripper_mode)//(ff1L < 0)
  {
    if (gripperOnline)
    {
      gv = map(gv, 180, 220, 2000, 1000);
      gv = checkPWMBounds(gv);
      gripper = slowIncrementPWM(gv, pastGripper);
    }
    if (wristOnline)
    {
    rotateWrist(rollR);
    //wrist = slowIncrementPWM(rollR, pastWrist);
    }
   
    //rollR = map(rollR, 60, 90, 1000, 2000);
    //rollR = checkPWMBounds(rollR);
    //wrist = slowIncrementPWM(rollR, pastWrist);
    pastGripper = gripper;
    pastWrist = wrist;
    //println("wrist " + str(wrist));
    //println("gripper " + str(gripper));
  }
  else if ((int)yv == 1 && (int)zv == 51 && (int)pv == -167)
  {
    yArm = pastY;
    xArm = pastX;
    wrist = pastWrist;
    theta1 = pastTheta1;
    theta2 = pastTheta2;
    endeY = pastEndeY;
    endeX = pastEndeX;
    joint2Y = pastJoint2Y;
    joint2X = pastJoint2X;
    gripper = pastGripper;
  }
  
  else
  {
    theta1 = solveTheta1(xArm, yArm, LENGTH1, LENGTH2);
    theta2 = solveTheta2(xArm, yArm, LENGTH1, LENGTH2);
  
  
    if (Float.isNaN(theta1) || Float.isNaN(theta2))
    {
      theta1 = pastTheta1;
      theta2 = pastTheta2;
      endeY = pastEndeY;
      endeX = pastEndeX;
    }
    
    joint2Y = (int)map(sin(theta1), -1, 1, 600, 200);
    joint2X = (int)map(cos(theta1), -1, 1, 500, 1000);
  
    theta1Deg = theta1 * (180/PI);
    theta2Deg = theta2 * (180/PI);
  
    //debug th1 and th2
    //if (theta1Deg > 180 || theta1Deg < -180 || theta2Deg > 180 || theta2Deg < -180)
    //{
    //  print("theta OoB: ");
    //  print(theta1Deg);
    //  print(" ");
    //  print(theta2Deg);
    //  print(" ");
    //}
  
    joint1PWM = map(theta1Deg, -180, 180, 1000, 2000);
    joint2PWM = map(theta2Deg, -180, 180, 2000, 1000);
  
    joint1PWM = checkPWMBounds(joint1PWM);
    joint2PWM = checkPWMBounds(joint2PWM);
  
    if (firstLoopCycle)
    {
      pastJoint1PWM = joint1PWM;
      pastJoint2PWM = joint2PWM;
      firstLoopCycle = false;
    }
  
    if (oneToOneSlow)
    {
      joint1PWM = slowIncrementPWM(joint1PWM,pastJoint1PWM);
      joint2PWM = slowIncrementPWM(joint2PWM,pastJoint2PWM);
    }
  }
  
  if (joint1Increment)
  {
    joint1PWM += 1;
  }
  else if (joint1Decrement)
  {
    joint1PWM += -1;
  }
  
  if (joint2Increment)
  {
    joint2PWM += 1;
  }
  else if (joint2Decrement)
  {
    joint2PWM += -1;
  }
  
  pastY = yArm;
  pastX = xArm;
  pastWrist = wrist;
  pastTheta1 = theta1;
  pastTheta2 = theta2;
  pastJoint1PWM = joint1PWM;
  pastJoint2PWM = joint2PWM;
  pastEndeY = endeY;
  pastEndeX = endeX;
  pastJoint2X = joint2X;
  pastJoint2Y = joint2Y;

  
  /***********************************************
  
      Output and Final Results
      
  ************************************************/  
  
  background(100);
  fill(255);
  textSize(height / 12);
  text("   pitch "   + (int)pv, 40, 50);
  text("         y " + (int)yv, 40, 130);
  text("         z " + (int)zv, 40, 210);
  text("         x " + (int)xv, 40, 290);
  text("fingers "    + (int)gv, 40, 370);
  text("    roll "   + (int)rollR, 40, 450);
  if (wristCW)
  {
    text("    roll "   + "CW", 40, 530);
  }
  else if (wristCCW)
  {
    text("    roll "   + "CCW", 40, 530);
  }
  else
  {
    text("    roll "   + "OFF", 40, 530);
  }
  text((int)ff1L, 90, 610);
  
  text("wristOnline      " + str(wristOnline), 400, 50);
  text("gripperOnline  " + str(gripperOnline), 400, 130);
  text("j1 j2 pause      " + str(wrist_gripper_mode), 400, 210);
  
  rect(ROVER_X, ROVER_Y, ROVER_WIDTH, ROVER_LENGTH);
  rect(LEG_X, LEG_Y, LEG_WIDTH, LEG_LENGTH);
  rect(LEG_X + LEG_SHIFT_RIGHT, LEG_Y, LEG_WIDTH, LEG_LENGTH);
  rect(LEG_X + LEG_SHIFT_RIGHT*2, LEG_Y, LEG_WIDTH, LEG_LENGTH);
  ellipse(WHEEL_X, WHEEL_Y, WHEEL_DIAMETER, WHEEL_DIAMETER);
  ellipse(WHEEL_X + WHEEL_SHIFT_RIGHT, WHEEL_Y, WHEEL_DIAMETER, WHEEL_DIAMETER);
  ellipse(WHEEL_X + WHEEL_SHIFT_RIGHT*2, WHEEL_Y, WHEEL_DIAMETER, WHEEL_DIAMETER);
  
  line(JOINT1_X_ORIGIN, JOINT1_Y_ORIGIN, joint2X, joint2Y);
  line(joint2X, joint2Y, endeX, endeY);
  
  ellipse(endeX, endeY, ENDE_DIAMETER, ENDE_DIAMETER);
  
  String message = str(int(joint1PWM)) + "/" + str(int(joint2PWM)) + "/" + str(int(wrist)) + "/" + str(wristOrientation) + "/" + str(shoulderOrientation) + "/" + str(lazySusanOrientation) + "/" + str(int(gripper)) + "/";
  
  //println(message);
  //String ip = "192.168.1.105";
  //int port = 8888;
  
  udp.send(message, IP, PORT);
  //println(message);
  //print(int(zv));
  //print(" x\t");
  //print(int(yv));
  //print(" y\t");
  //print(int(pv));
  //print(" wrist\t");
  //print(theta1);
  //print(" th1R\t");
  //print(theta2);
  //print(" th2R\t");
  //print(theta1Deg);
  //print(" th1D\t");
  //print(theta2Deg);
  //print(" th2D\t");
  //print(joint1PWM);
  //print(" j1PWM\t");
  //print(joint2PWM);
  //print(" j2PWM\t");
  //print(wrist);
  //println(" wrPWM");
  //delay(100);
  wristOrientation = 0;
}

  /***********************************************
  
      Receive Info from Arduino
      
  ************************************************/ 

void receive(byte[] data, String ip, int port)
{
  //println(data);
  data = subset(data, 0, data.length);
  String message = new String(data);
  
  //println("receive: \""+message+"\" from "+ip+" on port "+port);
  println(message);
}

  /***********************************************
  
      Math Functions
      
  ************************************************/ 

float solveTheta1(float x, float y, float l1, float l2)
{
  float c2 = (x*x + y*y - l1*l1 - l2*l2) / (2*l1*l2*1.0f);
  float s2 = sqrt(1 - c2*c2);
  
  float k1 = l1 + (l2*c2);
  float k2 = l2*s2;
  
  float t1 = atan2(y,x) - atan2(k2,k1);
  
  return t1;
}

float solveTheta2(float x, float y, float l1, float l2)
{
  float c2 = (x*x + y*y - l1*l1 - l2*l2) / (2*l1*l2*1.0f);
  float s2 = sqrt(1 - c2*c2);
  
  float t2 = atan2(s2,c2);
  
  return t2;
}

float checkPWMBounds(float PWMSignal)
{
  if (PWMSignal < 1000)
  {
    PWMSignal = 1000;
  }
  else if (PWMSignal > 2000)
  {
    PWMSignal = 2000;
  }
  
  return PWMSignal;
}

void rotateWrist (float wrst)
{
  if (wrst < 70 && wrst > 40)
  {
    wristCW = false;
    wristCCW = true;
    wristOrientation = 2;
    wrist -= oneToOneSlowIncrementFactor;
  }
  else if (wrst > 0 && wrst <= 40)
  {
    wristCW = true;
    wristCCW = false;
    wristOrientation = 1;
    wrist += oneToOneSlowIncrementFactor;
  }
  else
  {
    wristCW = false;
    wristCCW = false;
    wristOrientation = 0;
  }
}

//int slowIncrementGripper(int fingerDistance)
//{
//  if (fingerDistance > 220)
//  {
//    return ++gripper;
//  }
//  else if (fingerDistance < 180)
//  {
//    return --gripper;
//  }
//  return gripper;
//}

float slowIncrementPWM(float joint, float pastJoint)
{
  if (joint > pastJoint)
  {
    pastJoint += oneToOneSlowIncrementFactor;
  }
  else if (joint < pastJoint)
  {
    pastJoint -= oneToOneSlowIncrementFactor;
  }
  
//  if (pastJoint > joint || pastJoint < joint)
//  {
//    pastJoint = joint;
//  }

  
  return pastJoint;
}

void keyPressed()
{
  if (key == 'r')
  {
    reset = true;
  }
  
  if (key == 'a')
  {
    joint1Increment = true;//joint1PWM += 1;
  }
  else if (key == 'z')
  {
    joint1Decrement = true;//joint1PWM += -1;
  }
  
  if (key == 's')
  {
    joint2Increment = true;//joint2PWM += 1;
  }
  else if (key == 'x')
  {
    joint2Decrement = true;//joint2PWM += -1;
  }
  
  if (key == 'A')
  {
    //rotate clockwise
    lazySusanOrientation = 1;
    //println("a");
  }
  else if (key == 'D')
  {
    //rotate counter-clockwise
    lazySusanOrientation = 2;
    //println("d");
  }
  else
  {
    //no rotation
    lazySusanOrientation = 0;
    //println("lso 0");
  }
  
  if (key == 'W')
  {
    //rotate up
    shoulderOrientation = 2;
    //println("w");
  }
  else if (key == 'S')
  {
    //rotate down
    shoulderOrientation = 1;
    //println("s");
  }
  else
  {
    //no rotation
    shoulderOrientation = 0;
    //println("so 0");
  }
  
  if (key == 'g')
  {
    wrist_gripper_mode = !wrist_gripper_mode;//true;
  }
  else if (key == 'h')
  {
    wristOnline = true;
  }
  else if (key == 'j')
  {
    gripperOnline = true;
  }
}

void keyReleased()
{
  //if (key == 'g')
  //{
  // wrist_gripper_mode = false;
  //}
  if (key == 'h')
  {
   wristOnline = false;
  }
  if (key == 'j')
  {
   gripperOnline = false;
  }
  
    if (key == 'a')
  {
    joint1Increment = false;//joint1PWM += 1;
  }
  else if (key == 'z')
  {
    joint1Decrement = false;//joint1PWM += -1;
  }
  
  if (key == 's')
  {
    joint2Increment = false;//joint2PWM += 1;
  }
  else if (key == 'x')
  {
    joint2Decrement = false;//joint2PWM += -1;
  }
  
  reset = false;
  shoulderOrientation = 0;
  lazySusanOrientation = 0;
}
    