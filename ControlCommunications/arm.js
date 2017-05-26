/**
 *
 * Every movement command will be represented in 4 bytes
 * The first byte will be the object that needs to movement
 * in case of pwm signal object byte 3 and 4 will represent the signal between 1000 - 2000
 * in case of stepper motor byte 2 will be direction. Byte 3 will be on or off.  Byte 4 is still
 * up for grabs but will probably be steps
 */

var joint1_arr = new Uint16Array(3);
joint1_arr[2] = 0xbbaa;
var joint1_buff = Buffer.from(joint1_arr.buffer);

var joint2_arr = new Uint16Array(3);
joint2_arr[0] = 0x0002;
joint2_arr[2] = 0xbbaa;
var joint2_buff = Buffer.from(joint2_arr.buffer);

var joint3_arr = new Uint16Array(3);
joint3_arr[0] = 0x0003;
joint3_arr[2] = 0xbbaa;
var joint3_buff = Buffer.from(joint3_arr.buffer);

var joint4_arr = new Uint16Array(3);
joint4_arr[2] = 0xbbaa;
var joint4_buff = Buffer.from(joint4_arr.buffer);

var joint5_arr = new Uint16Array(3);
joint5_arr[2] = 0xbbaa;
var joint5_buff = Buffer.from(joint5_arr.buffer);

var joint6_arr = new Uint16Array(3);
joint6_arr[2] = 0xbbaa;
var joint6_buff = Buffer.from(joint6_arr.buffer);

var joint7_arr = new Uint16Array(3);
joint7_arr[2] = 0xbbaa;
var joint7_buff = Buffer.from(joint7_arr.buffer);

var armControl = new Uint16Array(3);
armControl[0] = 0x00ff;
armControl[1] = 0x0000;
armControl[2] = 0xbbaa;
var armControl_buff = Buffer.from(armControl.buffer);

module.exports = {

    /**
     * Move a joint a certain number of steps
     * @param {Number} jointNum values 1 - 7
     * @param {Number} steps # of steps to move that joint Can't be 0
     * @return {Buffer} armControl_buff Needs to be written to a port
     */
    stepJoint: function(jointNum, steps) {
        if (steps == 0) {
            throw new RangeError('Steps can not be zero');
        }

        switch (jointNum) {
            case 1:
                armControl[0] = 0x010a;
                armControl[1] = steps;
                break;
            case 4:
                armControl[0] = 0x040a;
                armControl[1] = steps;
                break;
            case 5:
                armControl[0] = 0x050a;
                armControl[1] = steps;
                break;
            case 6:
                armControl[0] = 0x060a;
                armControl[1] = steps;
                break;
            case 7:
                armControl[0] = 0x070a;
                armControl[1] = steps;
                break;
            default:
                throw new RangeError('Dumbass Joint must either 1, 4, 5, 6, 7');
        }

        return armControl_buff;
    },
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
            joint1_arr[0] = 0x0001;
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
    joint2_linear1: function(message, value) {
        joint2_arr[1] = value;

        return (joint2_buff);

    },

    /**
     * Joint3: Revenge of the Sith
     * Will be the smaller second linear Actuator
     * Driver: Actobotics Dual Motor Controller
     */
    joint3_linear2: function(message, value) {
        joint3_arr[1] = value;

        return (joint3_buff);
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
            joint4_arr[0] = 0x0104;
        } else {
            joint4_arr[0] = 0x0004;
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
            joint5_arr[0] = 0x0105;
        } else {
            joint5_arr[0] = 0x0005;
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
            joint6_arr[0] = 0x0106;
        } else {
            joint6_arr[0] = 0x0006;
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
            joint7_arr[0] = 0x0107;
        } else {
            joint7_arr[0] = 0x0007;
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
    },

    calibrate: function() {
        armControl[0] = 0x01ff;
        return (armControl_buff);
    },

    getJointInfo: function() {
        armControl[0] = 0x02ff;
        return (armControl_buff);
    }
};
