/**
* Author: Joseph Porter
* Description: Used to drive the stepper motors since the PI can't handle that kind of speed
*   This only handles the pulse pin's needed for the sumtor stepper motors
*/

// Joint1 pins
#define joint1_out 11
#define joint1_on 10

// Joint4 pins
#define joint4_on 9
#define joint4_out 8

// Joint5 pins
#define joint5_on 12
#define joint5_out 13

void setup()
{
  // Out pins is the pulse that the arduino should be sending
  // on pins is telling the ardunio that we want to move that stepper motor
  pinMode(joint1_out, OUTPUT);
  pinMode(joint1_on, INPUT);
  pinMode(joint4_out, OUTPUT);
  pinMode(joint4_on, INPUT);
  pinMode(joint5_out, OUTPUT);
  pinMode(joint5_on, INPUT);
}

void loop()
{
  // put your main code here, to run repeatedly:

  int joint1 = digitalRead(joint1_on);
  int joint4 = digitalRead(joint4_on);
  int joint5 = digitalRead(joint5_on);

  if(joint1 == 1)
  {
    digitalWrite(joint1_out, HIGH);
    digitalWrite(joint1_out, LOW);
  }

  if(joint4 == 1)
  {
    digitalWrite(joint4_out, HIGH);
    digitalWrite(joint4_out, LOW);
  }

  if(joint5 == 1)
  {
    digitalWrite(joint5_out, HIGH);
    digitalWrite(joint5_out, LOW);
  }

  delay(1);

}
