/*
    IK Solver using FABRIK algorithm from: https://www.academia.edu/9165835/FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem
    Author: Michael Negrete
    Date: 03/2017
 */

import arm_settings from './arm_settings.json';

const boneOne = {
    length: arm_settings.boneOne.width,
    angle: 0,
    x: 0,
    y: 0
};
const boneTwo = {
    length: arm_settings.boneTwo.width,
    angle: 0,
    x: arm_settings.boneOne.width,
    y: 0
};


function forwardReaching() {
    return "Forward Reaching";
}

/**
 * Solves forward direction of chain
 */
function backwardReaching() {
    // set end effector position to the target's positionflash.geom.Vector3D
    // Chain[chainLen + 1].position = target.position
    return "Backward Reaching";
}

/**
 * Solves IK using FABRIK Algorithm
 * @param {Object} target - {x: Number, y: Number, length: Number}.
 */
function solveIK(target) {
    let totalArmLength = boneOne.length + boneTwo.length;
    console.info('boneOne.x: ' + boneOne.x);
    console.info('boneTwo.x: ' + boneTwo.x);
    console.info('totalArmLength: ' + totalArmLength);

    // we have a list of pre-checks to run through
    // First, check if the target is out of reach
    /// if YES, then point all bones in a straight line to the target

    let delta, gamma, inverseGamma, xdelta, ydelta;
    if (Math.abs(target.x) > totalArmLength || Math.abs(target.y) > totalArmLength) {
        // target is out of reach

        // delta = _target.subtract(bone.globalPosition).length;

        // FIRST BONE CALCS
        xdelta = (target.x - boneOne.x);
        ydelta = (target.y - boneOne.y);
        delta = Math.sqrt( (xdelta * xdelta) + (ydelta * ydelta) );
        gamma = boneOne.length/delta;
        inverseGamma = 1.0 - gamma;

        boneOne.x = (inverseGamma * boneOne.x) + (gamma * target.x);
        boneOne.y = (inverseGamma * boneOne.y) + (gamma * target.y);

        console.info(
            'Bone One Calcs:\n' +
            'delta: ' + delta + '\n' +
            'gamma: ' + gamma + '\n' +
            'inverseGamma: ' + inverseGamma + '\n' +
            'boneOne.x: ' + boneOne.x + '\n' +
            'boneOne.y: ' + boneOne.y
        );

        // SECOND BONE CALCS
        xdelta = (target.x - boneTwo.x);
        ydelta = (target.y - boneTwo.y);
        delta = Math.sqrt(xdelta * xdelta + ydelta * ydelta);
        gamma = boneTwo.length/delta;
        inverseGamma = 1.0 - gamma;

        boneTwo.x = (inverseGamma * boneTwo.x) + (gamma * target.x);
        boneTwo.y = (inverseGamma * boneTwo.y) + (gamma * target.y);

        console.info(
            'Bone Two Calcs:\n' +
            'delta: ' + delta + '\n' +
            'gamma: ' + gamma + '\n' +
            'inverseGamma: ' + inverseGamma + '\n' +
            'boneTwo.x: ' + boneTwo.x + '\n' +
            'boneTwo.y: ' + boneTwo.y
        );

        return {boneOne, boneTwo};
    }
    else {
        // target is in reach
        // we know the target is solvable... Let's Do This! :D

        // forwardReaching();

        //
        // backwardReaching();
    }
}

module.exports.solveIK = solveIK;


/*
    Notes:
        -   It seems like it correctly find the x,y points when out of reach but idk...
            seems like its not... gotta test.
 */