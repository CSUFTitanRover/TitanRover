/*
  Cody Haddad
  4/17/2017
  using to position directinal antenna for rover base station

  Linear Actuator Control using preset position and two relays

  basic control of a large linear
  actuator using an Arduino, two relays, and three buttons. Each button is hard
  coded with a preset position. Pressing a button will move
  the actuator to that position and turn on a status les of last button used.
  This code also has a start position check and movement to the initial set
  location.

  The circuit:
  -arduino, breadboard, relayboard(not atcual relay)
  Pushbutton1 - Digital Pin 2 to button1 to resister to GND
  Pushbutton2 - Digital Pin 3 to button2 to resister to GND
  Pushbutton3 - Digital Pin 4 to button3 to resister to GND
  Relay1 - Digital Pin 7 to in1 on relay board
  Relay2 - Digital Pin 8 to in2 on relay board
  Led1 - Digital Pin 10 to led 1 to resister to GND
  Led2 - Digital Pin 11 to led 2 to resister to GND
  Led3 - Ditigal Pin 12 to led 3 to resister to GND
  Sensor Pin - Analog Pin 0 to wiper on actualtor: blue
  5v VCC to the colored wire on actuator: yellow
  GND to the colored wire on actuator: white
  5v VCC to relay board VCC
  GND to relay board GND
  use VCC jumper on board

  -relay 1 used to extendYaw
  12v from power supply into normally open (NO)
  **red from actuator into common, this is the only difference from relay 2
  GND from power suplly into normally closed (NC)

  -relay 2 used for retractYawing
  12v from power supply into normally open (NO)
  **black from actuator into common, this is the only difference from relay 1
  GND from power supply into normally closed (NC)


*/

// constants won't change. They're used here to set pin numbers:
const int button1Pin = 31;     // the number of the pushbutton1 pin to move to short of center (retractYaw)
const int button2Pin = 33;     // the number of the pushbutton2 pin to move to center (center)
const int button3Pin = 35;     // the number of the pushbutton3 pin to move to far of center (extendYaw)
const int button4Pin = 37;     // the number of the pushbutton3 pin to move to far of center (extendYaw)]
const int relay1Pin =  4;      // the number of the Realy1 pin for extendYawing
const int relay2Pin =  5;      // the number of the Relay2 pin for retractYawing
const int relay3Pin =  2;      // the number of the Realy1 pin for extendYawing
const int relay4Pin =  3;      // the number of the Relay2 pin for retractYawing
const int button1Led = 8;    //used to show user selected button 1, stays on if its the last button selected
const int button2Led = 9;    //used to show user selected button 2, stays on if its the last button selected
const int button3Led = 10;    //used to show user selected button 3, stays on if its the last button selected
const int button4Led = 11;    //used to show user selected button 3, stays on if its the last button selected
const int sensorYawPin = A0;    // select the input pin for the potentiometer
const int sensorPitchPin = A2;    // select the input pin for the potentiometer
const int near = 100;       //UPDATE with value to give 30 degree left of center, "retact"
const int center = 350;    //UPDATE with value to find the center of actuator
const int far = 600;      //UPDATE with value to give 30 degree right of center, "extendYaw"
const int up = 600;
const int straight = 60;

// variables will change:
int button1State = 0;         // variable for reading the pushbutton status
int button2State = 0;         // variable for reading the pushbutton status
int button3State = 0;         // variable for reading the pushbutton status
int button4State = 0;         // variable for reading the pushbutton status
int sensorYawValue = 0;        // variable to store the value coming from the sensor
int sensorPitchValue = 0;        // variable to store the value coming from the sensor
int goalYawValue = 0;     // center sensor value
int goalPitchValue = 0;
int currentYawPosition = 0;    //initializing a current postion that is overwritten on start
int currentPitchPosition = 0;

bool isAtPosition;
bool isStraight;

//function declaration (not needed in arduino though)
void retractYaw();
void extendYaw();
void middleYaw();
void adjustPitch();
void middlePitch();
void retractPitch();
void extendPitch();
void stopActuators();
//set up pin direction and status
void setup() {


  //start serial connection to confirm on screen for debugging or can be moved to lcd later:
  Serial.begin(9600);

  // initialize the pushbutton pin as an input:
  pinMode(button1Pin, INPUT);
  pinMode(button2Pin, INPUT);
  pinMode(button3Pin, INPUT);
  pinMode(button4Pin, INPUT);

  // initialize the relay pin as an output:
  pinMode(relay1Pin, OUTPUT);
  pinMode(relay2Pin, OUTPUT);
  pinMode(relay3Pin, OUTPUT);
  pinMode(relay4Pin, OUTPUT);
  // initialize the status leds as an output:
  pinMode(button1Led, OUTPUT);
  pinMode(button2Led, OUTPUT);
  pinMode(button3Led, OUTPUT);
  pinMode(button4Led, OUTPUT);

  //preset the relays to LOW:
  digitalWrite(relay1Pin, LOW);
  digitalWrite(relay2Pin, LOW);
  digitalWrite(relay3Pin, LOW);
  digitalWrite(relay4Pin, LOW);

  //preset the status leds to LOW:
  digitalWrite(button1Led, LOW);
  digitalWrite(button2Led, LOW);
  digitalWrite(button3Led, LOW);
  digitalWrite(button4Led, LOW);

  middleYaw();
  middlePitch();
}

//Start of program
void loop() {
  // read the value from the sensor to find the starting and current postition:
  //currentYawPosition = analogRead(sensorYawPin);
  bool isAtPosition = true;
  // read the state of the pushbutton values:
  button1State = digitalRead(button1Pin); //retractYaws left of center
  button2State = digitalRead(button2Pin); //centers itself
  button3State = digitalRead(button3Pin); //extendYaws right of center
  button4State = digitalRead(button4Pin); //changes pitch



  if (button1State == HIGH) {     //retractYaws to before center
    //change staus leds:
    Serial.println("Button 1 Tripped");
    digitalWrite(button2Led, LOW);
    digitalWrite(button3Led, LOW);
    digitalWrite(button1Led, HIGH);
    // set new goal position
    goalYawValue = near;
    isAtPosition = false;
    while (!isAtPosition) {
      currentYawPosition = analogRead(sensorYawPin);
      if ((currentYawPosition < goalYawValue + 10) && (currentYawPosition > goalYawValue - 10)) {
        stopActuators();
        isAtPosition = true;
        Serial.println("AT POSITION: " + currentYawPosition);
      } else {
        if (goalYawValue > currentYawPosition) {
          extendYaw();
        }
        else if (goalYawValue < currentYawPosition) {
          retractYaw();
        }
      }
    }
  }

  if (button2State == HIGH) {     //go to center
    //change staus leds:
    Serial.println("Button 2 Tripped");
    digitalWrite(button1Led, LOW);
    digitalWrite(button3Led, LOW);
    digitalWrite(button2Led, HIGH);
    // set new goal position:
    goalYawValue = center;   //update to value to center
    isAtPosition = false;
    while (!isAtPosition) {
      currentYawPosition = analogRead(sensorYawPin);
      if ((currentYawPosition < goalYawValue + 2) && (currentYawPosition > goalYawValue - 2)) {
        stopActuators();
        isAtPosition = true;
        Serial.println("AT YAW POSITION: " + currentYawPosition);
      } else {
        if (goalYawValue > currentYawPosition) {
          extendYaw();
        }
        else if (goalYawValue < currentYawPosition) {
          retractYaw();
        }
      }
    }
  }

  if (button3State == HIGH) {     //extendYaw far from center
    //change staus leds:
    Serial.println("Button 3 Tripped");
    digitalWrite(button1Led, LOW);
    digitalWrite(button2Led, LOW);
    digitalWrite(button3Led, HIGH);
    // set new goal position:
    goalYawValue = far;
    isAtPosition = false;
    while (!isAtPosition) {
      currentYawPosition = analogRead(sensorYawPin);
      if ((currentYawPosition < goalYawValue + 10) && (currentYawPosition > goalYawValue - 10)) {
        stopActuators();
        isAtPosition = true;
        Serial.println("AT YAW POSITION: " + currentYawPosition);
      } else {
        if (goalYawValue > currentYawPosition) {
          extendYaw();
        }
        else if (goalYawValue < currentYawPosition) {
          retractYaw();
        }
      }
    }
  }
  if (button4State == HIGH) {     //extendYaw far from center
    Serial.println("Button 4 Tripped");
    adjustPitch();
  }
}

//called function definitions
void retractYaw() {
  digitalWrite(relay1Pin, HIGH);
  digitalWrite(relay2Pin, LOW);
  digitalWrite(relay3Pin, LOW);
  digitalWrite(relay4Pin, LOW);
}

void extendYaw() {
  digitalWrite(relay1Pin, LOW);
  digitalWrite(relay2Pin, HIGH);
  digitalWrite(relay3Pin, LOW);
  digitalWrite(relay4Pin, LOW);
}

void retractPitch() {
  digitalWrite(relay3Pin, HIGH);
  digitalWrite(relay4Pin, LOW);
  digitalWrite(relay1Pin, LOW);
  digitalWrite(relay2Pin, LOW);
}

void extendPitch() {
  digitalWrite(relay3Pin, LOW);
  digitalWrite(relay4Pin, HIGH);
  digitalWrite(relay1Pin, LOW);
  digitalWrite(relay2Pin, LOW);
}

void stopActuators() {
  digitalWrite(relay1Pin, LOW);
  digitalWrite(relay2Pin, LOW);
  digitalWrite(relay3Pin, LOW);
  digitalWrite(relay4Pin, LOW);
}

void middleYaw() {
  //change staus leds:
  Serial.println("middleYaw Tripped");
  digitalWrite(button1Led, HIGH);
  digitalWrite(button3Led, HIGH);
  digitalWrite(button2Led, HIGH);
  // set new goal position:
  goalYawValue = center;   //update to value to center
  isAtPosition = false;
  while (!isAtPosition) {
    currentYawPosition = analogRead(sensorYawPin);
    Serial.println(currentYawPosition);
    if ((currentYawPosition < goalYawValue + 2) && (currentYawPosition > goalYawValue - 2)) {
      stopActuators();
      isAtPosition = true;
      Serial.println("AT YAW POSITION: " + currentYawPosition);
    } else {
      if (goalYawValue > currentYawPosition) {
        Serial.println("Extend Yaw");
        extendYaw();
      }
      else if (goalYawValue < currentYawPosition) {
        Serial.println("Retract Yaw");
        retractYaw();
      }
    }
  }
  digitalWrite(button1Led, LOW);
  digitalWrite(button3Led, LOW);
  digitalWrite(button2Led, LOW);
}

void middlePitch() {
  //change staus leds:
  Serial.println("middlePitch Tripped");
  digitalWrite(button1Led, HIGH);
  digitalWrite(button3Led, HIGH);
  digitalWrite(button2Led, HIGH);
  digitalWrite(button4Led, HIGH);
  // set new goal position:
  isStraight = false;   //update to value to center
  adjustPitch();
  digitalWrite(button1Led, LOW);
  digitalWrite(button3Led, LOW);
  digitalWrite(button2Led, LOW);
  digitalWrite(button4Led, LOW);
  Serial.println("Out of middlePitch");
}

void adjustPitch() {
  if (isStraight) {
    isStraight = false;
    digitalWrite(button4Led, HIGH);
    goalPitchValue = up;
  } else {
    isStraight = true;
    digitalWrite(button4Led, LOW);
    goalPitchValue = straight;
  }
  isAtPosition = false;
  while (!isAtPosition) {
    currentPitchPosition = analogRead(sensorPitchPin);
    if ((currentPitchPosition < goalPitchValue + 10) && (currentPitchPosition > goalPitchValue - 10)) {
      stopActuators();
      isAtPosition = true;
      Serial.println("AT PITCH POSITION: " + currentPitchPosition);
    } else {
      if (goalPitchValue > currentPitchPosition) {
        extendPitch();
      }
      else if (goalPitchValue < currentPitchPosition) {
        retractPitch();
      }
    }
  }
}
