/*
 IK Solver using FABRIK algorithm from: https://www.academia.edu/9165835/FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem
 Author: Michael Negrete
 Date: 03/2017
 */

const Victor = require('victor');

class Fabrik {

    /**
     * Constructor takes in an optional errorTolerance and optional maxAttemptsToSolve.
     * @param errorTolerance {Number} - Defines the allowed error when solving. Defaults to 0.01 if no value is supplied
     * @param maxAttemptsToSolve {Number} - Defines the max number of attempts to solve for. Defaults to 15 if no value is supplied.
     */
    constructor(errorTolerance = 0.001, maxAttemptsToSolve = 15) {
        this.points = [];
        this.lengths = [];
        this.totalArmLength = 0;
        this.errorTolerance = errorTolerance;
        this.maxAttemptsToSolve = maxAttemptsToSolve;
    };

    /**
     * Appends a bone to the chain.
     * @param length {Number} - length of the bone
     * @param startingAngle {Number} - Defaults to 0 degrees if no value is passed.
     */
    addBone(length, startingAngle = 0) {
        if(this.points.length === 0) {
            let p0 = Victor(0, 0); // setting a default point at (0,0)
            let p1X = length * Math.cos(startingAngle),
                p1Y = length * Math.sin(startingAngle);
            let p1 = Victor(p1X, p1Y);

            // append our points
            this.points.push(p0);
            this.points.push(p1);

            this.lengths.push(length); // append our length
            this.totalArmLength += length; // add to our total arm length
        }
        else {
            let endPoint = this.points[this.points.length-1];
            let newX = length * Math.cos(startingAngle) + endPoint.x,
                newY = length * Math.sin(startingAngle) + endPoint.y;
            let newPoint = Victor(newX, newY);

            this.points.push(newPoint); // append our point
            this.lengths.push(length); // append our length
            this.totalArmLength += length; // add to our total arm length
        }
    };

    /**
     * Loop from the end point to the base point
     */
    forwardReaching() {
        let delta, lambda, lambdaStar, newX, newY;
        for(let i = this.points.length-2; i > 0; i--) {
            // find calculations
            delta = this.points[i+1].distance(this.points[i]);
            lambda = this.lengths[i] / delta;
            lambdaStar = 1.0 - lambda;

            // update the points[i] position
            newX = (lambdaStar * this.points[i+1].x) + (lambda * this.points[i].x);
            newY = (lambdaStar * this.points[i+1].y) + (lambda * this.points[i].y);

            this.points[i].x = newX;
            this.points[i].y = newY;
        }
    }

    /**
     * Loop from the base point to the end point
     */
    backwardReaching() {
        // save the length value so it doesn't have to recalculate it on every iteration
        // since the array is expanded or shrinked in any way
        let delta, lambda, lambdaStar, newX, newY;
        for(let i=0, length = this.points.length; i < length - 1; i++) {

            // find calculations
            delta = this.points[i+1].distance(this.points[i]);
            lambda = this.lengths[i] / delta;
            lambdaStar = 1.0 - lambda;

            // update the points[i+1] position
            newX = (lambdaStar * this.points[i].x) + (lambda * this.points[i+1].x);
            newY = (lambdaStar * this.points[i].y) + (lambda * this.points[i+1].y);

            this.points[i+1].x = newX;
            this.points[i+1].y = newY;
        }
    }

    /**
     * Solves IK via FABRIK Algorithm
     * @param targetX {Number} - X coordinate of target
     * @param targetY {Number} - Y coordinate of target
     * @return {Array} - returns an array of Victor Objects
     */
    solveIK(targetX, targetY) {
        let target = Victor(targetX, targetY);

        let totalArmLengthSq = this.totalArmLength * this.totalArmLength;

        // First check if the target is out of reach
        // this means that the distance from the target to point Zero is greater
        // then the sum of all the lengths (which is the Max Reach)
        if ( this.points[0].distanceSq(target) > totalArmLengthSq) {
            // The Target is unreachable so let's stretch all of the bones in a single line pointing towards the target.

            console.log("Out of Reach");

            // save the length value so it doesn't have to recalculate it on every iteration
            // since the array is expanded or shrinked in any way
            let delta, lambda, lambdaStar, newX, newY;
            for(let i=0, length = this.points.length; i < length - 1; i++) {

                // find calculations
                delta = target.distance(this.points[i]);
                lambda = this.lengths[i] / delta;
                lambdaStar = 1.0 - lambda;

                // update the points[i+1] position
                newX = (lambdaStar * this.points[i].x) + (lambda * target.x);
                newY = (lambdaStar * this.points[i].y) + (lambda * target.y);

                this.points[i+1].x = newX;
                this.points[i+1].y = newY;
            }
        }
        else {
            // The Target is IN Reach.
            // First perform a sweep from the base point (p0) to the last point (pN)
            console.log("Within Reach");

            // initialize attemptsCounter for tracking if the solving takes too long
            let attemptsCounter = 0;

            // save the basePoint
            let initialPoint = this.points[0].clone();

            // Check whether the distance between the end effector pN and the target is greater than the errorTolerance
            let endPoint = this.points[this.points.length-1];
            let deltaDifference = endPoint.distance(target);

            while(deltaDifference > this.errorTolerance) {
                // Set the end point as the target
                endPoint.copy(target);
                this.forwardReaching();

                // go back and set pointZero to its Initial Point
                this.points[0].copy(initialPoint);
                this.backwardReaching();

                // recalculate the deltaDifference
                deltaDifference = endPoint.distance(target);

                // incrementing our number of attempts so far
                attemptsCounter += 1;

                // finally check if we are past our maxAttempts
                if (attemptsCounter > this.maxAttemptsToSolve) {
                    break;
                }
            }

            console.log("Iterations taken: " + attemptsCounter);
        }

        // finally return the solved Points
        return this.points;
    }
}

module.exports.Fabrik = Fabrik;