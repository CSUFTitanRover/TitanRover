/*
    IK Solver using FABRIK algorithm from: https://www.academia.edu/9165835/FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem
    Author: Michael Negrete
    Date: 03/2017
 */


function forwardReaching() {
    return;
}

/**
 * Solves forward direction of chain
 */
function backwardReaching() {
    // set end effector position to the target's position
    // Chain[chainLen + 1].position = target.position
    return;
}

/**
 * Solves IK using FABRIK Algorithm
 * @param {Object} target - target's x & y.
 */
function solveIK(target) {
    // we have a list of pre-checks to run through

    // we know the target is solvable... Let's Do This! :D

    forwardReaching();

    backwardReaching();
}
