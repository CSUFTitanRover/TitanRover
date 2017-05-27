/*
   Author: Joseph Porter

   Description:
    This is the control for the mobility and arm.  Which will be run on a Arduino Mega
    It will be reading from a serial communication line in 4 byte chunks
*/

#include <SPI.h>
#include <AMIS30543.h>
#include <Servo.h>
#include <Stepper.h>
#include <SoftwareSerial.h>
#include <Sabertooth.h>

const int stepsPerRevolution = 200;
// X Axis Mobility
/*Servo x_mobility;
  const uint8_t x_pwm_pin = 6;

  // Y Axis Mobility
  Servo y_mobility;
  const uint8_t y_pwm_pin = 7;*/

// Joint #1
const uint8_t joint1_dir_pin = 30;
const uint8_t joint1_enab_pin = 31;
const uint8_t joint1_pulse_pin = 29;
volatile bool joint1_on = false;
const uint8_t joint1_limit_pin = A0;
unsigned int joint1_sensorValue;
uint8_t joint1_bit;
uint8_t joint1_port;

// Joint #2
Servo joint2;
const uint8_t joint2_pwm_pin = 4;

// Joint #3
Servo joint3;
const uint8_t joint3_pwm_pin = 5;

// Joint #4
const uint8_t joint4_dir_pin = 34;
const uint8_t joint4_enab_pin = 35;
const uint8_t joint4_pulse_pin = 36;
volatile bool joint4_on = false;
volatile bool joint4_interrupted = false;
volatile bool joint4_needsStepOff = false;
const uint8_t joint4_interrupt_pin = 2;
volatile int joint4_TotalSteps = 0;
uint8_t joint4_bit;
uint8_t joint4_port;
const int joint4_StepsLimit = 740;
bool passedLimit = false;
const int joint4_LimitDistance_Steps = 15;

// Joint #5
const uint8_t joint5_dir_pin = 38;
const uint8_t joint5_enab_pin = 39;
const uint8_t joint5_pulse_pin = 40;
volatile bool joint5_on = false;
volatile bool joint5_interrupted = false;
volatile bool joint5_needsStepOff = false;
const uint8_t joint5_interrupt_pin = 3;
volatile int joint5_TotalSteps = 0;
uint8_t joint5_bit;
uint8_t joint5_port;
const int joint5_LimitDistance_Steps = 50;

// Joint #6
AMIS30543 joint6_stepper;
const uint8_t joint6_ss = 44;
const uint8_t joint6_dir_pin = 42;
const uint8_t joint6_pulse_pin = 43;
volatile bool joint6_on = false;

// Joint #7
AMIS30543 joint7_stepper;
const uint8_t joint7_ss = 48;
const uint8_t joint7_dir_pin = 46;
const uint8_t joint7_pulse_pin = 47;
volatile bool joint7_on = false;

// AssAss globals
Servo AssAss;
const uint8_t assass_pwm_pin = 9;

// Additional Global variables needed
uint8_t val[6];
int i;
int delayVal = 1;
uint16_t pwmVal;
const uint8_t interruptDelay = 250;
static unsigned long joint4_last_interrupt_time = 0;
static unsigned long joint5_last_interrupt_time = 0;

bool Calibrated = false;  // Arm can't be moved until calibrated
bool debug = false;
uint8_t analogRead_counter = 0;

//SoftwareSerial SWSerial(NOT_A_PIN, 18); // tx-1 on arduino mega
Sabertooth Back(129, Serial1);

void setup()
{
  SPI.begin();
  Serial.begin(9600);
  Serial1.begin(9600);
  Back.autobaud();

  delay(5);

  Back.drive(0);
  Back.turn(0);
  // Start the mobility on zero
  /*x_mobility.attach(x_pwm_pin);
    x_mobility.writeMicroseconds(1500);

    y_mobility.attach(y_pwm_pin);
    y_mobility.writeMicroseconds(1500);*/

  joint1_sensorValue = analogRead(joint1_limit_pin);

  // Setup the linear actuators
  joint2.attach(joint2_pwm_pin);
  //joint2.writeMicroseconds(1500);

  joint3.attach(joint3_pwm_pin);
  //joint3.writeMicroseconds(1500);

  // Set up Joint1
  pinMode(joint1_dir_pin, OUTPUT);
  pinMode(joint1_enab_pin, OUTPUT);
  pinMode(joint1_pulse_pin, OUTPUT);
  digitalWrite(joint1_enab_pin, LOW);

  // Set up Joint4
  pinMode(joint4_dir_pin, OUTPUT);
  pinMode(joint4_enab_pin, OUTPUT);
  pinMode(joint4_pulse_pin, OUTPUT);
  pinMode(joint4_interrupt_pin, INPUT);
  attachInterrupt(digitalPinToInterrupt(joint4_interrupt_pin), stopJoint4, FALLING);
  digitalWrite(joint4_enab_pin, LOW);

  // Set up Joint5
  pinMode(joint5_dir_pin, OUTPUT);
  pinMode(joint5_enab_pin, OUTPUT);
  pinMode(joint5_pulse_pin, OUTPUT);
  pinMode(joint5_interrupt_pin, INPUT);
  attachInterrupt(digitalPinToInterrupt(joint5_interrupt_pin), stopJoint5, FALLING);
  digitalWrite(joint5_enab_pin, LOW);

  // Set up the Polulu Stepper motors
  joint6_stepper.init(joint6_ss);
  joint6_stepper.resetSettings();
  joint6_stepper.setCurrentMilliamps(670);
  joint6_stepper.setStepMode(stepsPerRevolution);
  joint6_stepper.enableDriver();

  // Deselect the slave select pin for joint6 to allow joint7 to communicate
  //digitalWrite(joint6_ss, HIGH);

  joint7_stepper.init(joint7_ss);
  joint7_stepper.resetSettings();
  joint7_stepper.setCurrentMilliamps(670);
  joint7_stepper.setStepMode(stepsPerRevolution);
  joint7_stepper.enableDriver();

  // Set up AssAss
  AssAss.attach(assass_pwm_pin);

  // Arduino needs these functions to be wrapped in another function
  // This will set certain masks that allow use to detect the HIGH LOW of a pin faster
  setPortandBit();
}

void loop()
{
  // Will step of the limit switch if it has been triggered
  checkNeedToStepOffSwitch();

  // Check if pi has sent command data to Arduino
  if (Serial.available() >= 6)
  {
    // Grap the 4 bytes from the raspberry pi
    i = 0;
    while (i < 6)
    {
      val[i++] = Serial.read();
    }


    // If Safety checks don't pass reset buffer and stop rover
    if (val[4] != 0xaa && val[5] != 0xbb)
    {
      val[0] = 0;
      joint1_on = false;
      joint4_on = false;
      joint5_on = false;
      joint6_on = false;
      joint7_on = false;
      clearSerialBuffer();
    }

    if (debug)
    {
      printDebug(val);
    }

    // Convert the last two bytes into a 16 bit number
    pwmVal = 0x0000;
    pwmVal = (uint16_t)val[2];
    pwmVal = pwmVal | ((uint16_t)val[3] << 8);

    switch (val[0])
    {
      case 0x01:  // Joint1
        setDirectionPin(joint1_dir_pin, val[1]);
        joint1_on = val[3];
        break;
      case 0x02:  // Joint2
        if (Calibrated)
        {
          joint2.writeMicroseconds(pwmVal);
        }
        break;
      case 0x03:  // Joint3
        if (Calibrated)
        {
          joint3.writeMicroseconds(pwmVal);
        }
        break;
      case 0x04:  // Joint4
        setDirectionPin(joint4_dir_pin, val[1]);
        joint4_on = val[3];
        // Don't move joint4 if we have hit are limit switch until user returns to zero point
        if (joint4_interrupted && val[3] == 0x00)
        {
          joint4_interrupted = false;
        }
        break;
      case 0x05:  // Joint5
        setDirectionPin(joint5_dir_pin, val[1]);
        joint5_on = val[3];
        // Don't move joint5 if we have hit are limit switch until user returns to zero point
        if (joint5_interrupted && val[3] == 0x00)
        {
          joint5_interrupted = false;
        }
        break;
      case 0x06:  // Joint6
        setDirectionPin(joint6_dir_pin, val[1]);
        joint6_on = val[3];
        break;
      case 0x07:  // Joint7
        setDirectionPin(joint7_dir_pin, val[1]);
        joint7_on = val[3];
        break;
      case 0x08:  // x mobility
        Back.turn(val[2] - 127);
        //x_mobility.writeMicroseconds(pwnval);
        break;
      case 0x09:  // y mobility
        Back.drive((val[2] - 127));
        //y_mobility.writeMicroseconds(pwnval);
        break;
      case 0x0A:  // StepJoints
        // pwmVal should contain the total steps in both bytes val[2] and val[3]
        stepJointHandler(val[1], pwmVal);
        break;
      case 0x0B:
        //motor activation for the autonomous tasks
        back.motor(1,val[2]-127);
        break;
      case 0x0C:
        //motor activation for the autonomous tasks
        back.motor(2,val[2]-127);
        break;
      case 0xff:  // Auxillary functions
        if (val[1] == 0x01) // Calibrate the arm
        {
          calibrateArm();
        }
        else if (val[1] == 0x02)  // Send back step information
        {
          sendInfo();
        }
        else if (val[1] == 0x03)  // Update the speed of stepper motors
        {
          delayVal = val[3];
        }
        else if (val[1] == 0x04)  // Turn on debug values
        {
          if (debug)
          {
            Serial.println("Turning off debug");
          }
          else
          {
            Serial.println("Turning on debug");
          }
          debug = !debug;
        }
        else if (val[1] == 0x05)
        {
          operateAssAss(val[2]);
        }
        break;
      default:
        break;
    } // end of switch
  } // endif serial.available()


  // Check the POT's limits
  if (analogRead_counter % 4 == 0)
  {
    joint1_sensorValue = analogRead(joint1_limit_pin);
  }


  // Drive the stepper motors if they are activated
  if (joint1_on && Calibrated)
  {
    uint8_t state = (*portOutputRegister(joint1_port) & joint1_bit) ? HIGH : LOW;

    if (!state && joint1_sensorValue < 600)
    {
      if (analogRead_counter % 2 == 0)
      {
        digitalWrite(joint1_pulse_pin, HIGH);
        digitalWrite(joint1_pulse_pin, LOW);
      }
    }
    else if (state && joint1_sensorValue > 69)
    {
      if (analogRead_counter % 2 == 0)
      {
        digitalWrite(joint1_pulse_pin, HIGH);
        digitalWrite(joint1_pulse_pin, LOW);
      }
    }
  }

  if (joint4_on && joint4_interrupted == false && Calibrated)
  {
    /*uint8_t bit = digitalPinToBitMask(joint4_dir_pin);
      uint8_t port = digitalPinToPort(joint4_dir_pin);

      // Get the direction that the stepper was moving
      uint8_t state = (*portOutputRegister(port) & bit) ? HIGH : LOW;*/
    // Get the direction that the stepper was moving
    uint8_t state = (*portOutputRegister(joint4_port) & joint4_bit) ? HIGH : LOW;

    // Update the step count
    if (state)
    {
      joint4_TotalSteps--;
      if (joint4_TotalSteps < joint4_StepsLimit)
      {
        passedLimit = false;
      }
    }
    else
    {
      if (joint4_TotalSteps < joint4_StepsLimit)
      {
        joint4_TotalSteps++;
        passedLimit = false;
      }
      else
      {
        passedLimit = true;
      }
    }

    if (!passedLimit && analogRead_counter % 2 == 0)
    {
      digitalWrite(joint4_pulse_pin, HIGH);
      digitalWrite(joint4_pulse_pin, LOW);
    }
  }

  if (joint5_on && joint5_interrupted == false && Calibrated)
  {
    /*uint8_t bit = digitalPinToBitMask(joint5_dir_pin);
      uint8_t port = digitalPinToPort(joint5_dir_pin);

      // Get the direction that the stepper was moving
      uint8_t state = (*portOutputRegister(port) & bit) ? HIGH : LOW;*/
    // Get the direction that the stepper was moving
    uint8_t state = (*portOutputRegister(joint5_port) & joint5_bit) ? HIGH : LOW;

    // Update the step count
    if (state)
    {
      joint5_TotalSteps--;
    }
    else
    {
      joint5_TotalSteps++;
    }

    digitalWrite(joint5_pulse_pin, HIGH);
    digitalWrite(joint5_pulse_pin, LOW);
  }

  if (joint6_on && Calibrated)
  {
    digitalWrite(joint6_pulse_pin, HIGH);
    digitalWrite(joint6_pulse_pin, LOW);
  }

  if (joint7_on && Calibrated)
  {
    digitalWrite(joint7_pulse_pin, HIGH);
    digitalWrite(joint7_pulse_pin, LOW);
  }

  delay(delayVal);
  analogRead_counter++;

}

void stepJointHandler(uint8_t joint, int16_t steps)
{
  uint8_t dir = 0x01;
  if (steps < 0)
  {
    dir = 0x00;
    steps *= -1;
  }
  switch (joint)
  {
    case 0x01:
      // Need to add limit checking here
      setDirectionPin(joint1_dir_pin, dir);
      stepJoint(joint1_pulse_pin, steps);
      break;
    case 0x04:
      // Need to add limit checking here
      setDirectionPin(joint4_dir_pin, dir);
      stepJoint(joint4_pulse_pin, steps);
      break;
    case 0x05:
      // Need to add limit checking here
      setDirectionPin(joint5_dir_pin, dir);
      stepJoint(joint5_pulse_pin, steps);
      break;
    case 0x06:
      setDirectionPin(joint6_dir_pin, dir);
      stepJoint(joint6_pulse_pin, steps);
      break;
    case 0x07:
      // Need to add limit checking here
      setDirectionPin(joint7_dir_pin, dir);
      stepJoint(joint7_pulse_pin, steps);
  }

}

/*
   @param puslePin  This will be the pin used to step the motor
   @param steps     Number of steps to move the motor
*/
void stepJoint(uint8_t puslePin, uint16_t steps)
{
  for (int i = 0; i < steps; ++i)
  {
    digitalWrite(puslePin, HIGH);
    digitalWrite(puslePin, LOW);
    delay(delayVal);
  }
}

/*
 * Will make the AssAss open and close
 * @param operation Either 1 or 0 telling the AssAss to open or close
 */
void operateAssAss(uint8_t operation)
{
  if (operation == 0x01)  // Open
  {
    AssAss.write(90);
  }
  else if (operation == 0x00) // Close
  {
    delay(3000);
    AssAss.write(0);
  }
}

// Will switch the pin based on what byte is sent from the pi
void setDirectionPin(uint8_t pinValue, uint8_t val)
{
  if (val == 0x00)
  {
    digitalWrite(pinValue, LOW);
  }
  else if (val == 0x01)
  {
    digitalWrite(pinValue, HIGH);
  }
}

/*
   Will recalibrate the zero points for the joints
   Only joint4 and joint5 will need to have there zero points calibrated
   the rest can move to a predefined location
*/
void calibrateArm()
{

  Serial.println("Calibrating Arm");

  if (!Calibrated)
  {
    joint2.writeMicroseconds(2000);
    joint3.writeMicroseconds(2000);
  }
  Calibrated = true;

  // Run joint4 calibration
  digitalWrite(joint4_dir_pin, HIGH); // Run clock-wise to limit switch
  while (!joint4_interrupted)
  {
    digitalWrite(joint4_pulse_pin, HIGH);
    digitalWrite(joint4_pulse_pin, LOW);
    delay(delayVal);
  }

  // Run joint5 calibration
  digitalWrite(joint5_dir_pin, HIGH);
  while (!joint5_interrupted)
  {
    digitalWrite(joint5_pulse_pin, HIGH);
    digitalWrite(joint5_pulse_pin, LOW);
    delay(delayVal);
  }

  Serial.println("Finished Calibrating");

}

/*
   Will send statistics back to the pi
*/
void sendInfo()
{
  joint1_sensorValue = analogRead(joint1_limit_pin);
  Serial.print(joint4_TotalSteps);
  Serial.print(":");
  Serial.print(joint5_TotalSteps);
  Serial.print(":");
  Serial.println(joint1_sensorValue);
}

/*
   Interrupt function for joint4
   Will stop joint until user returns joystick to zero point
*/
void stopJoint4()
{
  unsigned long joint4_interrupt_time = millis();
  if (joint4_interrupt_time - joint4_last_interrupt_time > interruptDelay)
  {
    // Get the direction that the stepper was moving
    uint8_t state = (*portOutputRegister(joint4_port) & joint4_bit) ? HIGH : LOW;

    // Limit switch has been activated
    if (state)
    {
      joint4_interrupted = true;
      joint4_on = false;
      joint4_needsStepOff = true;
      joint4_TotalSteps = 0;
    }
  }
  joint4_last_interrupt_time = joint4_interrupt_time;
}

/*
   Interrupt function for joint5
   Will stop joint until user returns joystick to zero point
*/
void stopJoint5()
{
  unsigned long joint5_interrupt_time = millis();
  if (joint5_interrupt_time - joint5_last_interrupt_time > interruptDelay)
  {
    // Limit switch has been activated
    joint5_interrupted = true;
    joint5_on = false;
    joint5_needsStepOff = true;

    uint8_t state = (*portOutputRegister(joint5_port) & joint5_bit) ? HIGH : LOW;

    if (state)
    {
      joint5_TotalSteps = 0;
    }
  }
  joint5_last_interrupt_time = joint5_interrupt_time;
}

/*
   Will perform a certain number of steps to get off the limit switch
   @param dirPin  The direction pin used for that stepper
   @param pulsePin  The pin used to step the stepper motor
*/
void StepOffLimitSwitch(const uint8_t dirPin, const uint8_t pulsePin, const int LimitDistance_Steps)
{
  uint8_t bit = digitalPinToBitMask(dirPin);
  uint8_t port = digitalPinToPort(dirPin);

  // Get the direction that the stepper was moving
  uint8_t state = (*portOutputRegister(port) & bit) ? HIGH : LOW;
  digitalWrite(dirPin, !state);
  stepJoint(pulsePin, LimitDistance_Steps);
}

/*
   Arduino for some reason doesn't allow the bitmask and port functions to
   be used unless they are wrapped in a function
*/
void setPortandBit()
{
  joint1_bit = digitalPinToBitMask(joint1_dir_pin);
  joint1_port = digitalPinToPort(joint1_dir_pin);
  joint4_bit = digitalPinToBitMask(joint4_dir_pin);
  joint4_port = digitalPinToPort(joint4_dir_pin);
  joint5_bit = digitalPinToBitMask(joint5_dir_pin);
  joint5_port = digitalPinToPort(joint5_dir_pin);
}

void checkNeedToStepOffSwitch()
{
  if (joint4_needsStepOff)
  {
    Serial.println("Joint4 Limit Hit");
    StepOffLimitSwitch(joint4_dir_pin, joint4_pulse_pin, joint4_LimitDistance_Steps);
    joint4_needsStepOff = false;
  }

  if (joint5_needsStepOff)
  {
    Serial.println("Joint5 Limit Hit");
    StepOffLimitSwitch(joint5_dir_pin, joint5_pulse_pin, joint5_LimitDistance_Steps);
    joint5_needsStepOff = false;
  }
}

void clearSerialBuffer()
{
  Back.drive(0);
  Back.turn(0);

  uint8_t i = 0;
  Serial.println("Bytes Switched Clearing Buffer");
  while (Serial.available() > 0 && i < 64)
  {
    Serial.read();
    i++;
  }
}

void printDebug(uint8_t *val)
{
  Serial.print("Bytes: ");
  Serial.print(val[0]);
  Serial.print(":");
  Serial.print(val[1]);
  Serial.print(":");
  Serial.print(val[2]);
  Serial.print(":");
  Serial.print(val[3]);
  Serial.print(":");
  Serial.print(val[4]);
  Serial.print(":");
  Serial.println(val[5]);
}
