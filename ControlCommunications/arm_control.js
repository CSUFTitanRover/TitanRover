// Allows us to contorl the rpio pins on the raspberry pi
var rpio = require('rpio');
var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600
});

/** All GPIO pins are the actual pins so 1-40
 * @param {joint_move_pin}
 * This pin is used to tell the arduino to send the pulse signals
 * @param {joint_dir_pin}
 * Tells the stepper which direction it should go
 * @param {joint_enab_pin}
 * Tells the stepper motor to hold its position after movement.
 *
 * This applies to joint1, joint4, joint5 which are the sumtor stepper motor drivers
 */

// Joint1 rotating base pins
const joint1_dir_pin = 11;
const joint1_enab_pin = 13;
const joint1_on = '1';
const joint1_off = '2';

// Set all pins to low on init
rpio.open(joint1_dir_pin, rpio.OUTPUT, rpio.LOW);
rpio.open(joint1_enab_pin, rpio.OUTPUT, rpio.LOW);

// Joint2 PWM pins
const joint2_pwm_pin = 4;

// Joint3 PWM pins
const joint3_pwm_pin = 5;

// joint 4 Sumtor pins
const joint4_dir_pin = 32;
const joint4_enab_pin = 36;
const joint4_on = '3';
const joint4_off = '4';

// Set all pins to low on init
rpio.open(joint4_dir_pin, rpio.OUTPUT, rpio.LOW);
rpio.open(joint4_enab_pin, rpio.OUTPUT, rpio.LOW);

// joint 5 Sumtor pins
const joint5_dir_pin = 15;
const joint5_enab_pin = 18;
const joint5_on = '5';
const joint5_off = '6';

// Set all pins to low on init
rpio.open(joint5_dir_pin, rpio.OUTPUT, rpio.LOW);
rpio.open(joint5_enab_pin, rpio.OUTPUT, rpio.LOW);

// Joint 6 Pololu pins
const joint6_dir_pin = 12;
const joint6_on = '7';
const joint6_off = '8';

// Set all pins to low on init
rpio.open(joint6_dir_pin, rpio.OUTPUT, rpio.LOW);

// Joint 7 Pololu pins
const joint7_dir_pin = 16;
const joint7_on = '9';
const joint7_off = '0';

// Set all pins to low on init
rpio.open(joint7_dir_pin, rpio.OUTPUT, rpio.LOW);


// Pins to destroy
// Will be used when program exits to close these pins
var pins = [11, 12, 13, 15, 18, 32, 36];

/**
 * Joint1: Phantom Menace
 * The rotating base for the arm
 * Driver: Sumtor mb450a
 */
function joint1_rotatingBase(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        rpio.write(joint1_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint1_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint1_off);
    } else {
        port.write(joint1_on);
    }

}

/**
 * Joint2: Attack of the Clones
 * Will be the longer first linear Actuator
 * Driver: Actobotics Dual Motor Controller
 */
function joint2_linear1(message) {
    let value = parseInt(message.value);
    setLinearSpeed(joint2_pwm_pin, value);
}

/**
 * Joint3: Revenge of the Sith
 * Will be the smaller second linear Actuator
 * Driver: Actobotics Dual Motor Controller
 */
function joint3_linear2(message) {
    let value = parseInt(message.value);
    setLinearSpeed(joint3_pwm_pin, value);
}

/**
 * Joint4: A New Hope
 * The 180 degree wrist
 * Driver: Sumtor mb450a
 */
function joint4_rotateWrist(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        rpio.write(joint4_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint4_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint4_off);
    } else {
        port.write(joint4_on);
    }

}

/**
 * Joint5: Empire Strikes Back
 * The 90 degree joint
 * Driver: Sumtor mb450a
 */
function joint5_90degree(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        rpio.write(joint5_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint5_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint5_off);
    } else {
        port.write(joint5_on);
    }

}

/**
 * Joint6: Return of the Jedi
 * 360 degree rotation of this joint no need for limit switches
 * Driver is a Pololu
 */
function joint6_360Unlimited(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        rpio.write(joint6_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint6_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint6_off);
    } else {
        port.write(joint6_on);
    }
}

/**
 * Joint7: The Force Awakings
 * The gripper that is a linear actuator
 * Driver: Pololu AMIS-30543
 */
function joint7_gripper(message) {
    let value = parseInt(message.value);
    let direction = (value < 0) ? true : false;

    if (direction) {
        rpio.write(joint7_dir_pin, rpio.HIGH);
    } else {
        rpio.write(joint7_dir_pin, rpio.LOW);
    }

    if (value == 0) {
        port.write(joint7_off);
    } else {
        port.write(joint7_on);
    }
}

/**
 * Tell this joint to stop moving
 * @param {int} jointNum 1 - 7
 */
function stopJoint(jointNum) {
    switch (jointNum) {
        case 1:
            port.write(joint1_off);
            break;
        case 2:
            setLinearSpeed(joint2_pwm_pin, 0);
            break;
        case 3:
            setLinearSpeed(joint3_pwm_pin, 0);
            break;
        case 4:
            port.write(joint4_off);
            break;
        case 5:
            port.write(joint5_off);
            break;
        case 6:
            port.write(joint6_off);
            break;
        case 7:
            port.write(joint7_off);
            break;
        default:
            console.log(jointNum + " joint does not exist");
    }
}


// Will handle control of the arm one to one.
// Still need to figure out mapping of the joystick controller.
function armControl(message) {

    debug.Num_Arm_Commands += 1;

    if (message.type == 'axis') {
        var axis = parseInt(message.number);
        // Determine which axis should be which joint.
        switch (axis) {
            case 0:
                // Thumb button had to be pressed in order to use joint6
                if (thumbPressed) {
                    joint6_360Unlimited(message);
                } else {
                    joint3_linear2(message);
                }
                break;
            case 1:
                // Thumb button had to be pressed in order to use joint4
                if (thumbPressed) {
                    joint4_rotateWrist(message);
                } else {
                    joint2_linear1(message);
                }
                break;
            case 2:
                joint1_rotatingBase(message);
                break;
            case 3:
                // This is the throttle
                break;
            case 4:
                joint5_90degree(message);
                break;
            case 5:
                joint7_gripper(message);
                break;
            default:

        }
    } else if (message.type == 'button') {
        var button = parseInt(message.number);
        var val = parseInt(message.value);

        switch (button) {
            case 0:
                triggerPressed = val;
                break;
            case 1:
                // Switch our config to use other arm joints
                thumbPressed = (thumbPressed) ? false : true;
                if (thumbPressed) {
                    stopJoint(2);
                    stopJoint(3);
                } else {
                    stopJoint(4);
                    stopJoint(6);
                }
                break;
            default:
        }
    }
}

// Will close all the pins that were in use by this process
function closePins() {
    pins.forEach(function(value) {
        rpio.close(value);
    });
}
