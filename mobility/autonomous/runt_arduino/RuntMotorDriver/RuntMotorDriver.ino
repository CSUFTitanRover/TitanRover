#include <SoftwareSerial.h>

// connect motor controller pins to Arduino digital pins
// motor one
int enA = 10;
int in1 = 9;
int in2 = 8;
// motor two
int enB = 5;
int in3 = 7;
int in4 = 6;

const int stepsPerRevolution = 200;
//SoftwareSerial SWSerial(NOT_A_PIN, 1); // tx-1 on arduino mega

void setup(){
  Serial.begin(9600);
  //SWSerial.begin(9600);
  // set all the motor control pins to outputs
  pinMode(enA, OUTPUT);
  pinMode(enB, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);
}

void forward(){
  // now turn on motors
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);  
  digitalWrite(in3, HIGH);
  digitalWrite(in4, LOW); 
  // accelerate from zero to maximum speed
  analogWrite(enA, 255);
  analogWrite(enB, 255);
}

void right(){
  // now turn on motors
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);  
  digitalWrite(in3, HIGH);
  digitalWrite(in4, LOW); 
  // accelerate from zero to maximum speed
  analogWrite(enA, 255);
  analogWrite(enB, 255);
}

void left(){
  // now turn on motors
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);  
  digitalWrite(in3, LOW);
  digitalWrite(in4, HIGH); 
  // accelerate from zero to maximum speed
  analogWrite(enA, 255);
  analogWrite(enB, 255);
}

void stopRunt(){
  analogWrite(enA, 0);
  analogWrite(enB, 0);
}

void loop(){
  //reading communication from raspberry pi
  /*int val[4];  //byte storage
  // Check if pi has sent command data to Arduino
  if (Serial.available() >= 4)
  {
    // Grap the 4 bytes from the raspberry pi
    int i = 0;
    while (i < 4)
    {
      val[i++] = Serial.read();
    }
  }*/
  //forward();
  stopRunt();
  delay(5000);
}
