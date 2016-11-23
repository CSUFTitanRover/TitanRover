/*
 -with the 5TE / GS3
the WHITE wire is power. 
   - I hooked it up to the arduino 5v output pin, however you could also connect it to a pin and drive power only when you wanted it
the RED wire is the DATA_LINE.
   - you must hook it up to a pin that can process interrupts (see link below)
   
the remaining wire must be connected to ground
*/
/*
 * to properly calibrate these sensors we should apply this method
 * from Decagon: https://www.decagon.com/en/support/videos/soil-calibration-video/
 */
#include <SDISerial.h>

#define TRIGPIN 9
#define ECHOPIN 10
#define DHT_DATALINE 8 //DHT11 dataline pin.
#define DECAGON_DATALINE 2 //interrupt capable pin on the UNOs
#define INVERTED 1 
//see:   http://arduino.cc/en/Reference/attachInterrupt
//for pins that support interupts (2 or 3 on the UNO)

SDISerial sdi_serial_connection(DECAGON_DATALINE, INVERTED); //define our connection functions inputs

byte dat [5];
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

char* getMeasurement() {
  char* service_request = sdi_serial_connection.sdi_query("?M!",1000); //sending our query via connection
  char* service_request_complete = sdi_serial_connection.wait_for_response(1000); //waiting for the response from the sensor
  return sdi_serial_connection.sdi_query("?D0!", 1000); //it'll return as soon as we get a clean response
}

void setup() {
  sdi_serial_connection.begin(); //Start the SDI connection
  Serial.begin(9600); //start and specify the baud rate of our data
  pinMode(DHT_DATALINE, OUTPUT);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);
  Serial.println("...INITIALIZED"); //visually see in the stream that we're ready to recieve data
  delay(3000); //wait 3 seconds to allow sensor to run its startup cycle
}

void loop() {
  int plusCounter = 0; //initializing a counter every loop so we can know what data type we're after

  int wait_for_response_ms = 1000; //allow some time to allow for the sensor to send a response
  Serial.print("01"); //
  char* response = getMeasurement();
 if (response) { //lets parse our data!
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
    response = "No Response!";
    Serial.println(response);
  }
  Serial.println("/");
  free(response);
  delay(20);
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
  
  delay(1000); //give the sensor some time before the next response to avoid any broken data
}
