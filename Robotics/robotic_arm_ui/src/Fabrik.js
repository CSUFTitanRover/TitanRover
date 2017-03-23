/*
 IK Solver using FABRIK algorithm from: https://www.academia.edu/9165835/FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem
 Author: Michael Negrete
 Date: 03/2017
 */

const THREE = require('three');

class Fabrik {

    /**
     * Constructor takes in an optional errorTolerance and optional maxAttemptsToSolve.
     * @param {Number} [errorTolerance = 0.0001] - Defines the allowed error when solving. Defaults to 0.001 if no value is supplied.
     * @param {Number} [maxAttemptsToSolve = 15] - Defines the max number of attempts to solve for. Defaults to 15 if no value is supplied.
     */
    constructor(errorTolerance = 0.001, maxAttemptsToSolve = 15) {
        this.state = {
            points: [], // holds {Vector3} objects
            bones: [] // holds plain {Object}
        };
        this.totalArmLength = 0;
        this.errorTolerance = errorTolerance;
        this.maxAttemptsToSolve = maxAttemptsToSolve;
        this.RAD2DEG = (180 / Math.PI); // cache for use later on
        this.DEG2RAD = (Math.PI / 180); // cache for use later on
    };

    /**
     * Appends a bone to the chain.
     * @param {Object} bone - An object with properties "length" & "constraints"
     * @param {Number} [startingAngle = 0] - Expected value to be in degrees. Defaults to 0 degrees if no value is passed.
     */
    addBone(bone, startingAngle = 0) {
        if(this.state.points.length === 0) {
            let p0 = new THREE.Vector3(0, 0, 0); // init the first point at (0,0,0)
            let p1X = bone.length * Math.cos(startingAngle * this.DEG2RAD),
                p1Y = bone.length * Math.sin(startingAngle * this.DEG2RAD);
            let p1 = new THREE.Vector3(p1X, p1Y, 0); // start every vector's z value as 0

            // append our points
            this.state.points.push(p0);
            this.state.points.push(p1);

            this.state.bones.push(Object.assign({}, bone, {angle: startingAngle})); // append our new bone object w/ angle
            this.totalArmLength += bone.length; // add to our total arm length
        }
        else {
            let endPoint = this.state.points[this.state.points.length-1];
            let newX = bone.length * Math.cos(startingAngle * this.DEG2RAD) + endPoint.getComponent(0),
                newY = bone.length * Math.sin(startingAngle * this.DEG2RAD) + endPoint.getComponent(1);
            let newPoint = new THREE.Vector3(newX, newY, 0); // start every vector's z value as 0

            this.state.points.push(newPoint); // append our point
            this.state.bones.push(Object.assign({}, bone, {angle: startingAngle})); // append our new bone object w/ angle
            this.totalArmLength += bone.length; // add to our total arm length
        }
    };

    /**
     * Loop from the end point to the base point
     */
    forwardReaching() {
        let delta, lambda, lambdaStar, newX, newY;
        for(let i = this.state.points.length-2; i > 0; i--) {
            // find calculations
            delta = this.state.points[i+1].distanceTo(this.state.points[i]);
            lambda = this.state.bones[i].length / delta;
            lambdaStar = 1.0 - lambda;

            // update the points[i] position
            newX = (lambdaStar * this.state.points[i+1].getComponent(0)) + (lambda * this.state.points[i].getComponent(0));
            newY = (lambdaStar * this.state.points[i+1].getComponent(1)) + (lambda * this.state.points[i].getComponent(1));

            this.state.points[i].setComponent(0, newX);
            this.state.points[i].setComponent(1, newY);
        }
    }

    /**
     * Loop from the base point to the end point
     */
    backwardReaching() {
        // save the length value so it doesn't have to recalculate it on every iteration
        // since the array is expanded or shrinked in any way
        let delta, lambda, lambdaStar, newX, newY;
        for(let i=0, length = this.state.points.length; i < length - 1; i++) {

            // find calculations
            delta = this.state.points[i+1].distanceTo(this.state.points[i]);
            lambda = this.state.bones[i].length / delta;
            lambdaStar = 1.0 - lambda;

            // update the points[i+1] position
            newX = (lambdaStar * this.state.points[i].getComponent(0)) + (lambda * this.state.points[i+1].getComponent(0));
            newY = (lambdaStar * this.state.points[i].getComponent(1)) + (lambda * this.state.points[i+1].getComponent(1));

            this.state.points[i+1].setComponent(0, newX);
            this.state.points[i+1].setComponent(1, newY);
        }
    }

    /**
     * Solves IK via FABRIK Algorithm
     * @param {Number} targetX - X coordinate of target
     * @param {Number} targetY - Y coordinate of target
     * @return {Object} - returns an Object with "points" {Array of Vector3} & "bones" {Array of Objects}
     */
    solveIK(targetX, targetY) {
        const bones = this.state.bones;
        const points = this.state.points;

        let target = new THREE.Vector3(targetX, targetY, 0);
        let totalArmLengthSq = this.totalArmLength * this.totalArmLength;

        // First check if the target is out of reach
        // this means that the distance from the target to pointZero is greater
        // then the sum of all the bone lengths (which is the Max Reach)

        // if ( points[0].distanceSq(target) > totalArmLengthSq) {
        if (points[0].distanceToSquared(target) > totalArmLengthSq) {
            // The Target is unreachable so let's stretch all of the bones in a single line pointing towards the target.

            // save the length value so it doesn't have to recalculate it on every iteration
            // since the array is expanded or shrinked in any way
            let delta, lambda, lambdaStar, newX, newY;
            for(let i=0, length = points.length; i < length - 1; i++) {
                // find calculations
                delta = target.distanceTo(points[i]);
                lambda = bones[i].length / delta;
                lambdaStar = 1.0 - lambda;

                // update the points[i+1] position
                newX = (lambdaStar * points[i].getComponent(0)) + (lambda * target.getComponent(0));
                newY = (lambdaStar * points[i].getComponent(1)) + (lambda * target.getComponent(1));

                points[i+1].setComponent(0, newX);
                points[i+1].setComponent(1, newY);
            }
        }
        else {
            // The Target is IN Reach.
            // First perform a sweep from the base point (p0) to the last point (pN)

            // initialize attemptsCounter for tracking if the solving takes too long
            let attemptsCounter = 0;

            // save the basePoint
            let initialPoint = points[0].clone();

            // Check whether the distance between the end effector pN and the target is greater than the errorTolerance
            let endPoint = points[points.length-1];
            // let deltaDifference = endPoint.distance(target);
            let deltaDifference = endPoint.distanceTo(target);

            while(deltaDifference > this.errorTolerance) {
                // Set the end point as the target
                endPoint.copy(target);
                this.forwardReaching();

                // go back and set pointZero to its Initial Point
                points[0].copy(initialPoint);
                this.backwardReaching();

                // recalculate the deltaDifference
                deltaDifference = endPoint.distanceTo(target);

                // incrementing our number of attempts so far
                attemptsCounter += 1;

                // finally check if we are past our maxAttempts
                if (attemptsCounter > this.maxAttemptsToSolve) {
                    break;
                }
            }
        }

        // we've solved our points but before we return lets update the bone angles
        let newAngle, v, u, v_u;
        for(let i = 0, length = bones.length; i < length; i++) {
            // Method 1)
            // get the counter-clockwise angle with reference to the current point and the point[i+1]
            // v is the points[i+1], u is the current points[i]
            // 1. V - U
            // 2. atan2( v_u.y, v_u.x)

            // clone the point so we don't want to actually affect the vector
            v = points[i+1].clone();
            u = points[i];
            v_u = v.sub(u);
            newAngle = Math.atan2(v_u.getComponent(1), v_u.getComponent(0));
            newAngle = newAngle * this.RAD2DEG; // convert from radians to degrees
            bones[i].angle = newAngle;

            // Method 2)
            // atan2(v_y, v_x) - atan2(u_y, u_x)
            // v = Math.atan2(points[i+1].getComponent(1), points[i+1].getComponent(0));
            // u = Math.atan2(points[i].getComponent(1), points[i].getComponent(0));
            // newAngle = v - u;
            // newAngle = newAngle * this.RAD2DEG;
            // bones[i].angle = newAngle;
        }

        // finally return the solved state of the bones and points
        return this.state;
    }
}

module.exports.Fabrik = Fabrik;