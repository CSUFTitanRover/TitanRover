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
bool joint1_on = false;

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
bool joint4_on = false;

// Joint #5
const uint8_t joint5_dir_pin = 38;
const uint8_t joint5_enab_pin = 39;
const uint8_t joint5_pulse_pin = 40;
bool joint5_on = false;

// Joint #6
AMIS30543 joint6_stepper;
const uint8_t joint6_ss = 44;
const uint8_t joint6_dir_pin = 42;
const uint8_t joint6_pulse_pin = 43;
bool joint6_on = false;

// Joint #7
AMIS30543 joint7_stepper;
const uint8_t joint7_ss = 48;
const uint8_t joint7_dir_pin = 46;
const uint8_t joint7_pulse_pin = 47;
bool joint7_on = false;

// Will hold the bytes from the pi
uint8_t val[4];
int i;
int delayVal = 1;
uint16_t pwmVal;

SoftwareSerial SWSerial(NOT_A_PIN, 18); // tx-1 on arduino mega
Sabertooth Back(129, SWSerial);
Sabertooth Front(128, SWSerial);

void setup()
{
  SPI.begin();
  Serial.begin(9600);
  SWSerial.begin(9600);
  Back.autobaud();
  Front.autobaud();
  delay(1);

  Back.drive(0);
  Front.drive(0);
  Back.turn(0);
  Front.turn(0);
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
  digitalWrite(joint4_enab_pin, LOW);

  // Set up Joint5
  pinMode(joint5_dir_pin, OUTPUT);
  pinMode(joint5_enab_pin, OUTPUT);
  pinMode(joint5_pulse_pin, OUTPUT);
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
}

void loop()
{

  // Check if pi has sent command data to Arduino
  if (Serial.available() >= 4)
  {

    // Grap the 4 bytes from the raspberry pi
    i = 0;
    while (i < 4)
    {
      val[i++] = Serial.read();
    }

    // Convert the last two bytes into a 16 bit number to represent 1500 - 2000
    pwmVal = 0x0000;
    pwmVal = (uint16_t)val[2];
    pwmVal = pwmVal | ((uint16_t)val[3] << 8);

    if (val[0] == 0x01) // Joint1
    {
      setDirection(joint1_dir_pin, val[1]);
      joint1_on = val[3];
      if (val[2] != 0x00)
        stepJoint(joint1_pulse_pin, val[3]);
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
      setDirection(joint4_dir_pin, val[1]);
      joint4_on = val[3];
      if (val[2] != 0x00)
        stepJoint(joint4_pulse_pin, val[3]);
    }
    else if (val[0] == 0x05) // Joint5
    {
      setDirection(joint5_dir_pin, val[1]);
      joint5_on = val[3];
      if (val[2] != 0x00)
        stepJoint(joint5_pulse_pin, val[3]);
    }
    else if (val[0] == 0x06) // Joint6
    {
      setDirection(joint6_dir_pin, val[1]);
      joint6_on = val[3];
      if (val[2] != 0x00)
        stepJoint(joint6_pulse_pin, val[3]);
    }
    else if (val[0] == 0x07) // Joint7
    {
      setDirection(joint7_dir_pin, val[1]);
      joint7_on = val[3];
      if (val[2] != 0x00)
        stepJoint(joint7_pulse_pin, val[3]);
    }
    else if (val[0] == 0x08) // x-Mobility
    {
      Back.turn(val[2] - 127);
      Front.turn(val[2] - 127);
    }
    else if (val[0] == 0x09) // y-Mobility
    {
      Back.drive((val[2] - 127) * -1);
      Front.drive(val[2] - 127);
    }

  }


  // Drive the stepper motors if they are activated
  if (joint1_on)
  {
    digitalWrite(joint1_pulse_pin, HIGH);
    digitalWrite(joint1_pulse_pin, LOW);
  }

  if (joint4_on)
  {
    digitalWrite(joint4_pulse_pin, HIGH);
    digitalWrite(joint4_pulse_pin, LOW);
  }

  if (joint5_on)
  {
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

// Will step the joint between 1 and 200 steps
void stepJoint(uint8_t pinValue, uint8_t steps)
{
  for (int i = 0; i < steps; ++i)
  {
    digitalWrite(pinValue, HIGH);
    digitalWrite(pinValue, LOW);
    delay(delayVal);
  }
}

// Will switch the pin based on what byte is sent from the pi
void setDirection(uint8_t pinValue, uint8_t val)
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
