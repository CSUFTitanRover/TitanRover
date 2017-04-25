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
const uint8_t joint1_pulse_pin = 32;
volatile bool joint1_on = false;

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
const int joint4_StepsLimit = 750;
bool passedLimit = false;

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

// Additional Global variables needed
uint8_t val[4];
int i;
int delayVal = 2;
uint16_t pwmVal;
const uint8_t interruptDelay = 250;
static unsigned long joint4_last_interrupt_time = 0;
static unsigned long joint5_last_interrupt_time = 0;
const int LimitDistance_Steps = 50;

SoftwareSerial SWSerial(NOT_A_PIN, 18); // tx-1 on arduino mega
Sabertooth Back(129, SWSerial);

void setup()
{
  SPI.begin();
  Serial.begin(9600);
  SWSerial.begin(9600);
  Back.autobaud();

  delay(1);

  Back.drive(0);
  Back.turn(0);
  // Start the mobility on zero
  /*x_mobility.attach(x_pwm_pin);
    x_mobility.writeMicroseconds(1500);

    y_mobility.attach(y_pwm_pin);
    y_mobility.writeMicroseconds(1500);*/

  // Setup the linear actuators
  joint2.attach(joint2_pwm_pin);
  joint2.writeMicroseconds(1500);

  joint3.attach(joint3_pwm_pin);
  joint3.writeMicroseconds(1500);

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
  digitalWrite(joint6_ss, HIGH);

  joint7_stepper.init(joint7_ss);
  joint7_stepper.resetSettings();
  joint7_stepper.setCurrentMilliamps(670);
  joint7_stepper.setStepMode(stepsPerRevolution);
  joint7_stepper.enableDriver();

  // Arduino needs these functions to be wrapped in another function
  // This will set certain masks that allow use to detect the HIGH LOW of a pin faster
  setPortandBit();
}

void loop()
{
  // Will step of the limit switch if it has been triggered
  checkNeedToStepOffSwitch();

  // Check if pi has sent command data to Arduino
  if (Serial.available() >= 4)
  {
    // Grap the 4 bytes from the raspberry pi
    i = 0;
    while (i < 4)
    {
      val[i++] = Serial.read();
    }

    // Convert the last two bytes into a 16 bit number
    pwmVal = 0x0000;
    pwmVal = (uint16_t)val[2];
    pwmVal = pwmVal | ((uint16_t)val[3] << 8);

    if (val[0] == 0x01) // Joint1
    {
      setDirectionPin(joint1_dir_pin, val[1]);
      joint1_on = val[3];
    }
    else if (val[0] == 0x02) // Joint2
    {
      joint2.writeMicroseconds(pwmVal);
    }
    else if (val[0] == 0x03) // Joint3
    {
      joint3.writeMicroseconds(pwmVal);
    }
    else if (val[0] == 0x04) // Joint4
    {
      setDirectionPin(joint4_dir_pin, val[1]);
      joint4_on = val[3];

      // Don't move joint4 if we have hit are limit switch until user returns to zero point
      if (joint4_interrupted && val[3] == 0x00)
      {
        joint4_interrupted = false;
      }
    }
    else if (val[0] == 0x05) // Joint5
    {
      setDirectionPin(joint5_dir_pin, val[1]);
      joint5_on = val[3];

      // Don't move joint5 if we have hit are limit switch until user returns to zero point
      if (joint5_interrupted && val[3] == 0x00)
      {
        joint5_interrupted = false;
      }
    }
    else if (val[0] == 0x06) // Joint6
    {
      setDirectionPin(joint6_dir_pin, val[1]);
      joint6_on = val[3];
    }
    else if (val[0] == 0x07) // Joint7
    {
      setDirectionPin(joint7_dir_pin, val[1]);
      joint7_on = val[3];
    }
    else if (val[0] == 0x08) // x-Mobility
    {
      Back.turn(val[2] - 127);
      //x_mobility.writeMicroseconds(pwnval);
    }
    else if (val[0] == 0x09) // y-Mobility
    {
      Back.drive((val[2] - 127) * -1);
      //y_mobility.writeMicroseconds(pwnval);
    }
    else if (val[0] == 0x0A)  // Step a joint
    {
      // pwmVal should contain the total steps in both bytes val[2] and val[3]
      stepJointHandler(val[1], pwmVal);
    }
    else if (val[0] == 0xff) // All auxiliary functions
    {
      if (val[1] == 0x01) // Calibrate the arm
      {
        //calibrateArm();
      }
      else if (val[1] == 0x02)  // Send back step information
      {
        sendInfo();
      }
      else if (val[1] == 0x03)  // Update the speed of stepper motors
      {
        delayVal = val[3];
      }
    }

  }


  // Drive the stepper motors if they are activated
  if (joint1_on)
  {
    digitalWrite(joint1_pulse_pin, HIGH);
    digitalWrite(joint1_pulse_pin, LOW);
  }

  if (joint4_on && joint4_interrupted == false)
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

    if (!passedLimit)
    {
      digitalWrite(joint4_pulse_pin, HIGH);
      digitalWrite(joint4_pulse_pin, LOW);
    }
  }

  if (joint5_on && joint5_interrupted == false)
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

  if (joint6_on)
  {
    digitalWrite(joint6_pulse_pin, HIGH);
    digitalWrite(joint6_pulse_pin, LOW);
  }

  if (joint7_on)
  {
    digitalWrite(joint7_pulse_pin, HIGH);
    digitalWrite(joint7_pulse_pin, LOW);
  }

  delay(delayVal);

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

  // Run joint4 calibration
  digitalWrite(joint4_dir_pin, HIGH); // Run clock-wise to limit switch
  while (!joint4_interrupted)
  {
    digitalWrite(joint4_pulse_pin, HIGH);
    digitalWrite(joint4_pulse_pin, LOW);
    delay(delayVal);
  }

  joint4_TotalSteps = 0;

  // Run joint5 calibration
  digitalWrite(joint5_dir_pin, HIGH);
  while (!joint5_interrupted)
  {
    digitalWrite(joint5_pulse_pin, HIGH);
    digitalWrite(joint5_pulse_pin, LOW);
    delay(delayVal);
  }

  joint5_TotalSteps = 0;

}

/*
   Will send statistics back to the pi
*/
void sendInfo()
{
  Serial.print(joint4_TotalSteps);
  Serial.print(":");
  Serial.println(joint5_TotalSteps);
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
  }
  joint5_last_interrupt_time = joint5_interrupt_time;
}

/*
   Will perform a certain number of steps to get off the limit switch
   @param dirPin  The direction pin used for that stepper
   @param pulsePin  The pin used to step the stepper motor
*/
void StepOffLimitSwitch(const uint8_t dirPin, const uint8_t pulsePin)
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
  joint4_bit = digitalPinToBitMask(joint4_dir_pin);
  joint4_port = digitalPinToPort(joint4_dir_pin);
  joint5_bit = digitalPinToBitMask(joint5_dir_pin);
  joint5_port = digitalPinToPort(joint5_dir_pin);
}

void checkNeedToStepOffSwitch()
{
  if (joint4_needsStepOff)
  {
    StepOffLimitSwitch(joint4_dir_pin, joint4_pulse_pin);
    joint4_needsStepOff = false;
  }

  if (joint5_needsStepOff)
  {
    StepOffLimitSwitch(joint5_dir_pin, joint5_pulse_pin);
    joint5_needsStepOff = false;
  }
}
