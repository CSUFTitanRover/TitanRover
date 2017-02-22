#include <SPI.h>
#include <AMIS30543.h>

const uint8_t joint1_out = 8;
const char joint1_on = '1';
const char joint1_off = '2';
bool joint1_isOn = false;

const uint8_t joint4_out = 9;
const char joint4_on = '3';
const char joint4_off = '4';
bool joint4_isOn = false;

const uint8_t joint5_out = 10;
const char joint5_on = '5';
const char joint5_off = '6';
bool joint5_isOn = false;

const uint8_t joint6_out = 7;
const uint8_t joint6_ss = 3;
const char joint6_on = '7';
const char joint6_off = '8';
bool joint6_isOn = false;

AMIS30543 joint6_stepper;
AMIS30543 joint7_stepper;

void setup()
{
  SPI.begin();
  // put your setup code here, to run once:
  pinMode(joint1_out, OUTPUT);
  pinMode(joint4_out, OUTPUT);
  pinMode(joint5_out, OUTPUT);
  pinMode(joint6_out, OUTPUT);
  digitalWrite(joint6_out, LOW);
  pinMode(joint6_ss, OUTPUT);
  Serial.begin(9600);
  delay(1);

  joint6_stepper.init(joint6_ss);

  joint6_stepper.resetSettings();

  joint6_stepper.setCurrentMilliamps(670);

  joint6_stepper.setStepMode(200);

  joint6_stepper.enableDriver();
}

void loop() {
  // put your main code here, to run repeatedly:

  if(Serial.available() > 0)
  {
    // Find the joint we should turn on or off
    char num = Serial.read();

    // Either turn the stepper motors on or off
    if(num == joint1_on)
    {
      joint1_isOn = true;
    }
    else if(num == joint4_on)
    {
      joint4_isOn = true;
    }
    else if(num == joint5_on)
    {
      joint5_isOn = true;
    }
    else if(num == joint6_on)
    {
      joint6_isOn = true;
    }
    else if(num == joint1_off)
    {
      joint1_isOn = false;
    }
    else if(num == joint4_off)
    {
      joint4_isOn = false;
    }
    else if(num == joint5_off)
    {
      joint5_isOn = false;
    }
    else if(num == joint6_off)
    {
      joint6_isOn = false;
    }
  }

  if(joint1_isOn)
  {
    digitalWrite(joint1_out, HIGH);
    digitalWrite(joint1_out, LOW);
  }

  if(joint4_isOn)
  {
    digitalWrite(joint4_out, HIGH);
    digitalWrite(joint4_out, LOW);
  }

  if(joint5_isOn)
  {
    digitalWrite(joint5_out, HIGH);
    digitalWrite(joint5_out, LOW);
  }

  if(joint6_isOn)
  {
    digitalWrite(joint6_out, HIGH);
    digitalWrite(joint6_out, LOW);
  }

  delay(1);

}
