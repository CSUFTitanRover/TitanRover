/*
 * author: William Zschoche
 * 
 * Include libraries at the top of the source document. These signal the compiler
 * to look in the the specified libraries for keywords and function calls that we
 * will be using.
 * 
 * Servo.h:         allows us to easily write a PWM signal directly to servos.
 * 
 * PinChangeInt.h:  extends the Arduino unit's capabilities by "listening" for
 *                  changes in the incoming signals. The attachInterrupt() function
 *                  in the base library will listen for an entire duty cycle. For
 *                  our purposes this is a waste of resources and will not allow us
 *                  to realize control of the 12 actuators necessary for the full
 *                  project. More on how to use it later in the file.
 */

#include <Servo.h>
#include <PinChangeInt.h>

/*
 * Pre-define the pins used on the Arduino board. All pins defined are digital pins.
 * 
 * REL_IN_PIN:      Input pin receiveing the incoming PWM signal from the X8R
 *                  receiver(the remote control) that controls the linear actuator.
 * 
 * RELAY1_OUT_PIN:  Pin outputting to relay 1.
 * RELAY2_OUT_PIN:  Pin outputting to relay 2.
 * 
 * REL_FLAG:        Bit flag to let the Arduino system know there is a change in the
 *                  state of the incoming signal (Changing from HIGH to LOW,
 *                  or vice versa).
 * 
 * **Note:  BIT FLAGS are represented in base 10 in this source code
 *          (1, 2, 4, up to 256). In base 2 we can treat a 8-bit unsigned integer as
 *          a quick and dirty 8-element boolean array. In this version of the code.
 *          
 *          EX: 1     = 00000001
 *              2     = 00000010
 *              1 + 2 = 00000011
 *          
 *          We may use a 16-bit number for double the flags, however we only two
 *          flags for this project.
 */

#define REL_IN_PIN 10
#define RELAY1_OUT_PIN 7
#define RELAY2_OUT_PIN 8
#define REL_FLAG 2

/*
 * END_IN_PIN:    Input pin receiveing the incoming PWM signal from X8R receiver
 *                (the remote control) that controls the end effector.
 *                
 * END_OUT_PIN:   Pin outputting to end effector.
 * 
 * END_FLAG:      Bit flag to let the Arduino system know there is a change in the
 *                state of the incoming signal (Changing from HIGH to LOW,
 *                or vice versa).
 */

#define END_IN_PIN 11
#define END_OUT_PIN 2
#define END_FLAG 1

/*
 * bUpdateFlagsShared is the variable that holds the bit flags.
 * 
 * **NOTE:  "volatile" keyword tells the compiler to allow this variable to be
 *          modified outside of the MAIN control loop. Normally, the Arduino will
 *          "lock-out" other processes. We need these variables to be open so we can
 *          allow sensors to intrrupt the main loop and modify them.
 */

volatile uint8_t bUpdateFlagsShared;

/*
 * volatile uint16_t usEndInShared: 16-bit, unsigned, integer that stores how long
 *                                  the incloming PWM signalfor the end effector is
 *                                  HIGH. A 16-bit variable is called a 'short'.
 * 
 * volatile uint16_t usRelInShared: 16-bit unsigned integer that stores how long the
 *                                  incloming PWM signal for the relay is high.
 *                                  
 * **NOTE:  On the naming convention,
 *          [if unsigned][bits][what it does][if shared (read volatile)]
 *          So, usEndInShared means [unsigned][short][end effector input][shared]
 *                                  
 * **NOTE:  The duty cycle of these servos is 20,000 microseconds. Therefore, an
 *          8-bit, unsigned variable will not work because the maximum value it can
 *          hold is 256. The next size variable available is 16-bits which can store
 *          an unsigned integer between 0 and 65,536.
 */

volatile uint16_t usEndInShared;
volatile uint16_t usRelInShared;

/*
 * uint32_t ulEndStart: [unsigned][long][end effector signal start-time]
 *                      When the Arduino "senses" a change in the end effector input
 *                      pin from LOW to HIGH, the system time in microseconds, is
 *                      saveded to the 32-bit integer variable ulEndStart. More on
 *                      this later in the code.
 *                      
 * uint32_t ulRelStart: [unsigned][long][relay signal start-time]
 *                      Just like the end effector, this is the variable that saves
 *                      the start-time for the realy controlling the linear actuator
 *                      
 *                      Later,
 *                      when the signal changes back from HIGH to LOW, the ulEndStart
 *                      is subtracted from the current time. Like a timer, the
 *                      difference gives us the signal time length to tell the end
 *                      effector servo. I 
 */

uint32_t ulEndStart;
uint32_t ulRelStart;

/*
 * Servo servoEnd: [class][name of instance]
 *                 Here we are telling the compiler that there will be a instance of
 *                 the Servo class. Creating servoEnd and attaching it to the output
 *                 pin for the end effector will allow us to control the servo in it.
 *                 The methods in the Servo class will handle all of the background
 *                 magic to make it all happen.
 */

Servo servoEnd;

void setup()
{
  /*
   * Start the default serial port at standard baudrate 9600.
   * This opens communication with the serial monitor on
   * the computer connected to the arduino unit through the
   * USB port.
  */
  Serial.begin(9600);

  /*
   * Before we can begin communication to the end effector, we must "attach" the
   * output pin to the instance of the Servo class we created earlier. This will
   * allow us to manipulate the servo.
   */
  
  servoEnd.attach(END_OUT_PIN);

  /*
   * Because the linear actuator is controlled by two relays, we cannot use the Servo
   * class to manage how we control it. Instead, we must control the relays directly.
   * Don't worry, it's very simple. Much like the Servo class, first we much declare
   * which pins are the outputs for the two relays.
   */
  
  pinMode(RELAY1_OUT_PIN, OUTPUT);
  pinMode(RELAY2_OUT_PIN, OUTPUT);

  /*
   * This code tells the compiler that we will be listeing to REL_IN_PIN and
   * END_IN_PIN for changes in the signal (remember, LOW to HIGH). When there is a
   * change in signal, execute the function calcRel or calcEnd, respective to the
   * pin.
   */
  
  PCintPort::attachInterrupt(REL_IN_PIN, calcRel, CHANGE);
  PCintPort::attachInterrupt(END_IN_PIN, calcEnd, CHANGE);
}

void loop() {

  /*
   * static uint16_t usEndIn: [unsigned][short: 16-bit][end effector input]
   * static uint16_t usRelIn: [unsigned][short: 16-bit][end relay input]
   *                          Local variables get created and destroyed every time
   *                          the function they reside in is called, so the value is
   *                          not retained. Making the variable 'static' retains the
   *                          variable through subsequent iterations of the main
   *                          loop, so the value inside is intact.
   *                          
   * **NOTE:  We will be using these variables to hold copies of the raw input values
   *          from the receiver. We have to hold copies of the input values in
   *          usEndInShared, usRelInShared, and bUpdateFlagsShared because we cannot
   *          guarantee we will have read access to these variables when it comes
   *          time to use them; also, we cannot guarantee the values won't be updated
   *          mid-loop.
   */

  static uint16_t usEndIn;
  static uint16_t usRelIn;
  
  static uint8_t bUpdateFlags;

  /*
   * This is an if statement. It means 
   * if (such and such is true) {
   *     do is... 
   *     and this...
   * }
   * 
   * In the following statement there is some programming trickery.
   * if(bUpdateFlagsShared), means: if bUpdateFlagsShared has any value other than
   * 0, do the following code. In Arduino, indeed in all of the languages I've
   * encountered, false is represented as 0. So the following code will be executed
   * provided there are bit-flags indicating there are values to process.
   */
  
  if(bUpdateFlagsShared) {

    /*
     * Remember those copies I mentioned just before? This is where we do it.
     * "noInterrupts()" tells the system that we won't be taking any new values while
     * we make our copies.
     */
    noInterrupts();

    //make a copy of the bit-flags
    bUpdateFlags = bUpdateFlagsShared;

    /*
     * Here we are checking if there is flag for the relay input.
     * "bUpdateFlags & REL_FLAG", is a Bitwise AND operation. The condition checks if
     * there is bit-flag for the relay operation.
     * 
     * To visualize:
     * 
     * If there was only one flag indicating we had a new input signal for the relay
     * 
     * 0  0  1  0    bUpdateFlags
     * 0  0  1  0    REL_FLAG
     * ----------
     * 0  0  1  0    (bUpdateFlags & REL_FLAG) = returned result
     * 
     * (4 in binary which is not 0, so the result is TRUE)
     * 
     * We now will go and get a copy of the input value for the relay.
     * 
     * What if bUpdateFlags was 0?
     * 
     * 0  0  0  0    bUpdateFlags
     * 0  0  1  0    REL_FLAG
     * ----------
     * 0  0  0  0    (bUpdateFlags & REL_FLAG) = returned result
     * 
     * (0 in binary, so the result is FALSE)
     * 
     * What if bUpdateFlags only had a bit flag for the end effector?
     * 
     * 0  0  0  1    bUpdateFlags
     * 0  0  1  0    REL_FLAG
     * ----------
     * 0  0  0  0    (bUpdateFlags & REL_FLAG) = returned result
     * 
     * (0 in binary, so the result is FALSE)
     */
    if(bUpdateFlags & REL_FLAG)
    {
      usRelIn = usRelInShared;
    }
    
    if(bUpdateFlags & END_FLAG)
    {
      usEndIn = usEndInShared;
    }

    //We've processed all of the necessary flags. Reset bUpdateFlagsShared to 0 so it
    //can receive new flags from the interrupts.
    bUpdateFlagsShared = 0;

    //resume allowing interrupts to write data.
    interrupts();
  }

  /*
   * Now that we have shiny new values to play with, lets use them to control our
   * end effector and relay.
   * 
   * First we check for a flag to process the respective data.
   */
  
  if(bUpdateFlags & REL_FLAG)
  {
    // This line is commented out because it was used for debug purposes
    // Serial.println(usRelIn);

    /*
     * usRelIn has holds the length of time the input signal was HIGH. If the input
     * signal is HIGH for less than 1100 microseconds, we retract the linear actuator
     * connected to the relay. if the signal is greater than 1900 microseconds, we
     * extend the linear actuator. If the value is anwhere in between, we simply turn
     * both relays off and the linear actuator will not move.
     * 
     * digitalWrite(RELAY2_OUT_PIN,1);          // Turns Relay Off
     * digitalWrite(RELAY1_OUT_PIN,0);          // Turns ON Relay 1
     * 
     * The linear actuator exends and retracts depending on the polarity of the
     * eletricity flowing to it. To "flip" the polarity, we connected 2 relays in an
     * H-Bridge configuration. Turning relay 1 on and relay 2 off makes the
     * the electricity flow in one direction. if we turn relay 1 off and relay 2 on,
     * the polarity reverses. If we turn both relays off, the circuit is broken and
     * the linear actuator does nothing.
     */
    
    if(usRelIn < 1100) {
      //sometimes the signal is missed between toggles
      //confirm relay 2 is off. otherwise no movement, relays cancel out
      digitalWrite(RELAY2_OUT_PIN,1);          // Turns Relay Off
      digitalWrite(RELAY1_OUT_PIN,0);          // Turns ON Relay 1
    }
    else if(usRelIn > 1900) {
      //cofnirm relay 1 is off
      digitalWrite(RELAY1_OUT_PIN,1);          // Turns Relay Off
      digitalWrite(RELAY2_OUT_PIN,0);          // Turns ON Relay 2
    }
    else {
      digitalWrite(RELAY1_OUT_PIN,1);          // Turns Relay 1 Off
      digitalWrite(RELAY2_OUT_PIN,1);          // Turns Relay 2 Off
    }
  }

  //check for an end effector flag
  if(bUpdateFlags & END_FLAG)
  {
    /*
     * Here we are checking fit the old value for servoEnd is not equal to the new
     * If there is no change, there is no reason to update the value we are sending
     * to the end effector servo.
     */
    
    if(servoEnd.readMicroseconds() != usEndIn)
    {
      /*
       * The servo in the end effector can only handle signal values that are natural
       * numbers between 1000 and and 2000. being an unsigned integer automatically
       * handles the natural number part. But what about the upper and lower bounds?
       * Sometimes the receiver will get pulses that are less than 1000 and greater
       * than 2000 (on testing, I received signals ranging from 994 and 2015
       * microseconds). Sending a signal that exceeds the bounds of the servo could
       * damage it. The following conditions automatically set any incoming signal
       * that is excessive or deficient to its respective bound. All other values in
       * between are untouched.
       */
      if(usEndIn < 1000)
        usEndIn = 1000;
      else if(usEndIn > 2000)
        usEndIn = 2000;

      /*
       * The end effector is tough but it's not tough enough to withstand constant
       * pressure from the servo within. We can't limit the servo with conditions
       * like we did before because the dial would only work within conditions
       * So, we have to limit servo yet again witout losing the range of output of
       * the dial controlling the opening and closing of the fingers. If the fingers
       * close too tight, we risk damaging the lower plate, washer, and spacers.
       * If the servo opens too wide, we risk cracking the casing and damaging the
       * lower plate.
       * 
       * The solution is to map the values between valid inputs, 1000 and 2000, to a
       * restricted, safe range. After testing, I found the acceptable ranges to be
       * 1220 to 1480.
       */
      
      usEndIn = map(usEndIn, 1000, 2000, 1220, 1480);
      
      //print the final output for debugging purposes.
      //Serial.println(usEndIn);

      //And finally, we update the servo with the new signal value, and it will
      //rotate to the new position.
      servoEnd.writeMicroseconds(usEndIn);
    }
  }

  //Now that we've processed the incoming signals, zero out the bit-flag variable
  //so it's ready for the next loop.
  bUpdateFlags = 0;
}

/*
 * These are the functions called when a new inturrupt arrives. Remember these?
 * 
 * PCintPort::attachInterrupt(REL_IN_PIN, calcRel, CHANGE);
 * PCintPort::attachInterrupt(END_IN_PIN, calcEnd, CHANGE);
 */
 
void calcRel()
{

  //if the input signal is HIGH,
  if(digitalRead(REL_IN_PIN) == HIGH)
  { 
    //get the current system time in microseconds and save it
    ulRelStart = micros();
  }
  else
  {
    /*
     * Else the signal must be LOW and we can calculate the signal length
     * Get the current system time, subtract the start time we saved earlier,
     * and save the result for processing.
     */
    usRelInShared = (uint16_t)(micros() - ulRelStart);

    //Remove the relay bit flag from the bit-flag variable.
    bUpdateFlagsShared |= REL_FLAG;
  }
}

/*
 * calcEnd does the same thing as calcRel, just with different variables.
 * See the previous function for details.
 */
void calcEnd()
{
  if(digitalRead(END_IN_PIN) == HIGH)
  { 
    ulEndStart = micros();
  }
  else
  {
    usEndInShared = (uint16_t)(micros() - ulEndStart);
    bUpdateFlagsShared |= END_FLAG;
  }
}
