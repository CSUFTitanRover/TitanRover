/**
 *
 * Every movement command will be represented in 4 bytes
 * The first byte will be the object that needs to movement
 * in case of pwm signal object byte 3 and 4 will represent the signal between 1000 - 2000
 * in case of stepper motor byte 2 will be direction. Byte 3 will be on or off.  Byte 4 is still
 * up for grabs but will probably be steps
 */
var x_Axis_arr = new Uint16Array(2);
x_Axis_arr[0] = 0x0800;
var x_Axis_buff = Buffer.from(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(2);
y_Axis_arr[0] = 0x0900;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);

var joint1_arr = new Uint16Array(2);
var joint1_buff = Buffer.from(joint1_arr.buffer);

var joint2_arr = new Uint16Array(2);
joint2_arr[0] = 0x0200;
var joint2_buff = Buffer.from(joint2_arr.buffer);

var joint3_arr = new Uint16Array(2);
joint3_arr[0] = 0x0300;
var joint3_buff = Buffer.from(joint3_arr.buffer);

var joint4_arr = new Uint16Array(2);
var joint4_buff = Buffer.from(joint4_arr.buffer);

var joint5_arr = new Uint16Array(2);
var joint5_buff = Buffer.from(joint5_arr.buffer);

var joint6_arr = new Uint16Array(2);
var joint6_buff = Buffer.from(joint6_arr.buffer);

var joint7_arr = new Uint16Array(2);
var joint7_buff = Buffer.from(joint7_arr.buffer);

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

function getPwmValue(value) {
    if (value <= 0) {
        value = value.map(config.Joystick_MIN, 0, 1000, 1500);
    } else {
        value = value.map(0, config.Joystick_MAX, 1500, 2000);
    }

    return value;
}

module.exports = {
    /**
     * Joint1: Phantom Menace
     * The rotating base for the arm
     * Driver: Sumtor mb450a
     */
    joint1_rotatingBase: function(message) {
        let value = parseInt(message.value);
        let direction = value < 0;

        // Turn counter clockwise
        if (direction) {
            joint1_arr[0] = 0x0101;
        } else {
            joint1_arr[0] = 0x0100;
        }

        //Stop else move a certain amount of steps
        if (value === 0) {
            joint1_arr[1] = 0x0000;
        } else {
            joint1_arr[1] = 0x0100;
        }

        return joint1_buff;

    },

    /**
     * Joint2: Attack of the Clones
     * Will be the longer first linear Actuator
     * Driver: Actobotics Dual Motor Controller
     */
    joint2_linear1: function(message) {
        let value = parseInt(message.value);

        value = getPwmValue(value);

        joint2_arr[1] = value;

        return (joint2_buff);

    },

    /**
     * Joint3: Revenge of the Sith
     * Will be the smaller second linear Actuator
     * Driver: Actobotics Dual Motor Controller
     */
    joint3_linear2: function(message) {
        let value = parseInt(message.value);

        value = getPwmValue(value);

        joint2_arr[1] = value;

        return (joint2_buff);
    },

    /**
     * Joint4: A New Hope
     * The 180 degree wrist
     * Driver: Sumtor mb450a
     */
    joint4_rotateWrist: function(message) {
        let value = parseInt(message.value);
        let direction = value < 0;

        if (direction) {
            joint4_arr[0] = 0x0401;
        } else {
            joint4_arr[0] = 0x0400;
        }

        if (value === 0) {
            joint4_arr[1] = 0x0000;
        } else {
            joint4_arr[1] = 0x0100;
        }

        return (joint4_buff);
    },

    /**
     * Joint5: Empire Strikes Back
     * The 90 degree joint
     * Driver: Sumtor mb450a
     */
    joint5_90degree: function(message) {
        let value = parseInt(message.value);
        let direction = value < 0;

        if (direction) {
            joint5_arr[0] = 0x0501;
        } else {
            joint5_arr[0] = 0x0500;
        }

        if (value === 0) {
            joint5_arr[1] = 0x0000;
        } else {
            joint5_arr[1] = 0x0100;
        }

        return (joint5_buff);
    },

    /**
     * Joint6: Return of the Jedi
     * 360 degree rotation of this joint no need for limit switches
     * Driver is a Pololu
     */
    joint6_360Unlimited: function(message) {
        let value = parseInt(message.value);
        let direction = value < 0;

        if (direction) {
            joint6_arr[0] = 0x0601;
        } else {
            joint6_arr[0] = 0x0600;
        }

        if (value === 0) {
            joint6_arr[1] = 0x0000;
        } else {
            joint6_arr[1] = 0x0100;
        }

        return (joint6_buff);
    },

    /**
     * Joint7: The Force Awakings
     * The gripper that is a linear actuator
     * Driver: Pololu AMIS-30543
     */
    joint7_gripper: function(message) {
        let value = parseInt(message.value);
        let direction = value < 0;

        if (direction) {
            joint7_arr[0] = 0x0701;
        } else {
            joint7_arr[0] = 0x0700;
        }

        if (value === 0) {
            joint7_arr[1] = 0x0000;
        } else {
            joint7_arr[1] = 0x0100;
        }

        return (joint7_buff);
    },

    /**
     * Tell this joint to stop moving
     * @param {int} jointNum 1 - 7
     */
    stopJoint: function(jointNum) {
        let send_buff = null;
        switch (jointNum) {
            case 1:
                joint1_arr[1] = 0x0000;
                send_buff = joint1_buff;
                break;
            case 2:
                joint2_arr[1] = 0x05dc;
                send_buff = joint2_buff;
                break;
            case 3:
                joint3_arr[1] = 0x05dc;
                send_buff = joint3_buff;
                break;
            case 4:
                joint4_arr[1] = 0x0000;
                send_buff = joint4_buff;
                break;
            case 5:
                joint5_arr[1] = 0x0000;
                send_buff = joint5_buff;
                break;
            case 6:
                joint6_arr[1] = 0x0000;
                send_buff = joint6_buff;
                break;
            case 7:
                joint7_arr[1] = 0x0000;
                send_buff = joint7_buff;
                break;
            default:
                throw new RangeError('Joint must be between ' + 1 + ' and ' + 7);
        }

        return send_buff;
    }
};
