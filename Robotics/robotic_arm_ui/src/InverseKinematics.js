/*
    IK Solver using FABRIK algorithm from: https://www.academia.edu/9165835/FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem
    Author: Michael Negrete
    Date: 03/2017
 */

import arm_settings from './arm_settings.json';

const d1 = arm_settings.d1, d2 = arm_settings.d2;
const p1 = {
    x: 0,
    y: 0
};
const p2 = {
    x: d1.length,
    y: 0
};

const p3 = {
    x: d1.length + d2.length,
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
    let totalArmLength = d1.length + d2.length;
    console.info('totalArmLength: ' + totalArmLength);

    // we have a list of pre-checks to run through
    // First, check if the target is out of reach
    /// if YES, then point all bones in a straight line to the target

    let delta, lambda, lambdaStar, xdelta, ydelta;
    xdelta = (target.x - p1.x);
    ydelta = (target.y - p1.y);
    let targetDistance = Math.sqrt( (xdelta * xdelta) + (ydelta * ydelta) );

    if (Math.abs( targetDistance ) > totalArmLength) {
        // target is out of reach

        // delta = _target.subtract(bone.globalPosition).length;

        // FIRST BONE CALCS
        xdelta = (target.x - p1.x);
        ydelta = (target.y - p1.y);
        delta = Math.sqrt( (xdelta * xdelta) + (ydelta * ydelta) );
        lambda = d1.length/delta;
        lambdaStar = 1.0 - lambda;

        p2.x = (lambdaStar * p1.x) + (lambda * target.x);
        p2.y = (lambdaStar * p1.y) + (lambda * target.y);

        console.info(
            'Bone One Calcs:\n' +
            'delta: ' + delta + '\n' +
            'lambda: ' + lambda + '\n' +
            'lambdaStar: ' + lambdaStar + '\n' +
            'p2.x: ' + p2.x + '\n' +
            'p2.y: ' + p2.y
        );

        // SECOND BONE CALCS
        xdelta = (target.x - p2.x);
        ydelta = (target.y - p2.y);
        delta = Math.sqrt(xdelta * xdelta + ydelta * ydelta);
        lambda = d2.length/delta;
        lambdaStar = 1.0 - lambda;

        p3.x = (lambdaStar * p2.x) + (lambda * target.x);
        p3.y = (lambdaStar * p2.y) + (lambda * target.y);

        console.info(
            'Bone Two Calcs:\n' +
            'delta: ' + delta + '\n' +
            'lambda: ' + lambda + '\n' +
            'lambdaStar: ' + lambdaStar + '\n' +
            'p3.x: ' + p3.x + '\n' +
            'p3.y: ' + p3.y
        );

        return {p2, p3};
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