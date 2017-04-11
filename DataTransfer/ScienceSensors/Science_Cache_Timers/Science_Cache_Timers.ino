/*DEPENDANCIES FOR ALL SCIENCE SENSORS
 * SDISerial - Necesary for the 5TE Soil Sensor
 * Wire, necesary for the CO2 Sensors
*/
#include <SDISerial.h>
#include <Wire.h>
/*------*/
/*DEFINE ALL TRIG PINS AND NECESARY VARIABLES FOR USAGE*/
#define TRIGPIN 9//Sonic Range Finder
#define ECHOPIN 10//Sonic Range Finder
#define DHT_DATALINE 8 //DHT11 dataline pin.
#define DECAGON_DATALINE 2 //5TE Dataline(RED WIRE)
#define INVERTED 1 //FOR 5TE SOIL, NOT A PIN

int co2Addr = 0x68;//I2c default address for CO2 Sensors
byte dat [5];//Initializes Dat fir DHT11 Tempurature Sensor
SDISerial sdi_serial_connection(DECAGON_DATALINE, INVERTED);//Sets up SDISerial connectiong for the 5TE

int currentTime;//initilizes the variable to be constantly udpated with current time

bool CO2HasStarted = false; 
int CO2Timer;
/*-------*/

void setup() {
  // put your setup code here, to run once:
  sdi_serial_connection.begin(); //Start the SDI connection
  Serial.begin(9600); //start and specify the baud rate of our data
  pinMode(DHT_DATALINE, OUTPUT);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);
  Wire.begin();
  Serial.println("...SENSORS INITIALIZED"); //visually see in the stream that we're ready to recieve data
  Serial.println("...TIMERS INITIALIZED");
  delay(3000); //wait 3 seconds to allow sensor to run its startup cycle
}

void loop() {
  // put your main code here, to run repeatedly:
  SoilSensor();
  TempuratureSensor();
  SonicRangeFinder();
  
  if(CO2HasStarted == false) {
    startCO2();//needs AT LEASST 10MS between start and Read
    CO2Timer = millis();
    CO2HasStarted=true;
  }
  currentTime = millis();
  if (CO2HasStarted == true && (currentTime - CO2Timer) >= 10)
  {
    CarbonDioxideSensor();
    CO2HasStarted=false;
  }
}

/*ALL FUNCTIONS TO RUN SENSORS IN LOOP*/
/*SONIC RANGE FINDER*/
void SonicRangeFinder() {
  long duration, distance;
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGPIN, LOW);
  duration = pulseIn(ECHOPIN, HIGH);
  distance = (duration/2)/29.1;
  Serial.print("03:");
  Serial.print(distance);
  Serial.println("/");
}
/*------*/
/*DHT11*/
void TempuratureSensor() {
  start_test ();
  Serial.print ("02:");
  Serial.print (dat [0], DEC); // display the humidity-bit integer;
  Serial.print ('.');
  Serial.print (dat [1], DEC); // display the humidity decimal places;
  Serial.print (":");
  Serial.print (dat [2], DEC); // display the temperature of integer bits;
  Serial.print ('.');
  Serial.print (dat [3], DEC); // display the temperature of decimal places;
  Serial.println ("/");
}

void start_test () {
  digitalWrite (DHT_DATALINE, LOW); // bus down, send start signal
  delay (30); // delay greater than 18ms, so DHT11 start signal can be detected
 
  digitalWrite (DHT_DATALINE, HIGH);
  delayMicroseconds (40); // Wait for DHT11 response
 
  pinMode (DHT_DATALINE, INPUT);
  while (digitalRead (DHT_DATALINE) == HIGH);
  delayMicroseconds (80); // DHT11 response, pulled the bus 80us
  if (digitalRead (DHT_DATALINE) == LOW);
  delayMicroseconds (80); // DHT11 80us after the bus pulled to start sending data
 
  for (int i = 0; i < 4; i ++) // receive temperature and humidity data, the parity bit is not considered
    dat[i] = read_data ();
 
  pinMode (DHT_DATALINE, OUTPUT);
  digitalWrite (DHT_DATALINE, HIGH); // send data once after releasing the bus, wait for the host to open the next Start signal
}

byte read_data () {
  byte data;
  for (int i = 0; i < 8; i ++) {
    if (digitalRead (DHT_DATALINE) == LOW) {
      while (digitalRead (DHT_DATALINE) == LOW); // wait for 50us
      delayMicroseconds (30); // determine the duration of the high level to determine the data is '0 'or '1'
      if (digitalRead (DHT_DATALINE) == HIGH)
        data |= (1 << (7-i)); // high front and low in the post
      while (digitalRead (DHT_DATALINE) == HIGH); // data '1 ', wait for the next one receiver
     }
  }
  return data;
}
/*-------*/
/*5TE SOIL SENSOR*/
char* getMeasurement() {
  char* service_request = sdi_serial_connection.sdi_query("?M!",1000); //sending our query via connection
  char* service_request_complete = sdi_serial_connection.wait_for_response(1000); //waiting for the response from the sensor
  return sdi_serial_connection.sdi_query("?D0!", 1000); //it'll return as soon as we get a clean response
}

void SoilSensor() {
  int plusCounter = 0;
  char* response = getMeasurement();
  if (response) { //lets parse our data!
    Serial.print("01"); //
      for (int i = 0; i < 16; i++) { //lets count all the spaces in the response array and read out the data peice by peice to parse
        if (i == 0) { //ignore the first set as it's only there to display that we got a response
          i++; //iterate to the next element immediately
        }
        if (response[i] == '+') { 
          //if we see a plus sign, lets assign a data type to the next set of data
          plusCounter++; //we want to keep track of the amount of plus signs to help differentiate data.
          //Serial.print(response[i]); //display the + sign to sparse the data visually
          if (plusCounter == 1) {
            //for Electrical Conductivity
            Serial.print(":");
          } else if (plusCounter == 2) {
            //For volumetric Water Content
            Serial.print(":");
          } else if (plusCounter == 3) {
            //For Soil Temp in C
            Serial.print(":");
          }
          i++; //iterate to the next element immediately
        }
          Serial.print(response[i]); //print out the remainder of the data until another + is hit
      }
  }
  else if (response == NULL) { 
    //if we get a bad response from the soil sensor we'll print no response
    Serial.println("No Response");
  }
  Serial.println("/");
  free(response);
}
/*------*/
/*CO2 Sensor*/
void CarbonDioxideSensor() {
  int co2Value = readCO2();//start c02 Sensor read
  if(co2Value > 0)
  {
    Serial.print("04:");
    Serial.print(co2Value);
    Serial.println("/");
  }
  else
  {
  }
}
int startCO2(){
  digitalWrite(13, HIGH);
  Wire.beginTransmission(co2Addr);
  Wire.write(0x22);
  Wire.write(0x00);
  Wire.write(0x08);
  Wire.write(0x2A);
  Wire.endTransmission();
}

int readCO2()
{
  int co2_value = 0;
  /////////////////////////
  /* Begin Read Sequence */
  /////////////////////////
  /*
  Since we requested 2 bytes from the sensor we must
  read in 4 bytes. This includes the payload, checksum,
  and command status byte.
  */
  Wire.requestFrom(co2Addr, 4);
  
  byte i = 0;
  byte buffer[4] = {0, 0, 0, 0};
  /*
  Wire.available() is not nessessary. Implementation is obscure but we leave
  it in here for portability and to future proof our code
  */
  while(Wire.available())
  {
    buffer[i] = Wire.read();
    i++;
  }
  ///////////////////////
  /* End Read Sequence */
  ///////////////////////
  /*
  Using some bitwise manipulation we will shift our buffer
  into an integer for general consumption
  */
  co2_value = 0;
  co2_value |= buffer[1] & 0xFF;
  co2_value = co2_value << 8;
  co2_value |= buffer[2] & 0xFF;
  byte sum = 0; //Checksum Byte
  sum = buffer[0] + buffer[1] + buffer[2]; //Byte addition utilizes overflow
  if(sum == buffer[3])
  {
    // Success!
    digitalWrite(13, LOW);
    return co2_value;
  }
  else
  {
    // Failure!
    /*
    Checksum failure can be due to a number of factors,
    fuzzy electrons, sensor busy, etc.
    */
    digitalWrite(13, LOW);
    return 0;
  }
}
/*-----*/
