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
    x: arm_settings.boneTwo.width,
    y: 0
};


function forwardReaching() {
    return;
}

/**
 * Solves forward direction of chain
 */
function backwardReaching() {
    // set end effector position to the target's positionflash.geom.Vector3D
    // Chain[chainLen + 1].position = target.position
    return;
}

/**
 * Solves IK using FABRIK Algorithm
 * @param {Object} target - {x: Number, y: Number, length: Number}.
 */
function solveIK(target) {
    let boneOneLength = arm_settings.boneOne.width;
    let boneTwoLength = arm_settings.boneTwo.width;
    let totalArmLength = boneOneLength + boneTwoLength;

    // we have a list of pre-checks to run through
    // First, check if the target is out of reach
    /// if YES, then poiint all bones in a straight line to the target
    let delta, gamma, inverseGamma;
    if (target.length > totalArmLength) {
        // target is out of reach

        // delta = _target.subtract(bone.globalPosition).length;
        let xdelta = (target.x - boneOne.x);
        let ydelta = (target.y - boneOne.y);
        delta = Math.sqrt(xdelta*xdelta + ydelta*ydelta);
        gamma = bone.length/delta;
        inverseGamma = 1.0 - gamma;

        boneOne.x = (inverseGamma*boneOne.x) + gamma*target.x;
        boneOne.y = (inverseGamma*boneOne.y) + gamma*target.y;

    }
    else {
        // target is in reach
        // we know the target is solvable... Let's Do This! :D

        forwardReaching();

        backwardReaching();
    }



}
