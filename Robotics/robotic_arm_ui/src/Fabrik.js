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
        this.addBone = this.addBone.bind(this);
        this.solveIK = this.solveIK.bind(this);
    };

    /**
     * Appends a bone to the chain.
     * @param {Object} bone - An object with properties "length" & "constraints"
     * @param {Number} [startingLocalAngle = 0] - Expected value to be in degrees. Defaults to 0 degrees if no value is passed.
     */
    addBone(bone, startingLocalAngle = 0) {
        if(this.state.points.length === 0) {
            let p0 = new THREE.Vector3(0, 0, 0); // init the first point at (0,0,0)
            let p1X = bone.boneLength * Math.cos(startingLocalAngle * this.DEG2RAD),
                p1Y = bone.boneLength * Math.sin(startingLocalAngle * this.DEG2RAD);
            let p1 = new THREE.Vector3(p1X, p1Y, 0); // start every vector's z value as 0

            // append our points
            this.state.points.push(p0);
            this.state.points.push(p1);

            let boneAngleInfo = {globalAngle: startingLocalAngle, localAngle: startingLocalAngle};
            this.state.bones.push(Object.assign({}, bone, boneAngleInfo)); // append our new bone object w/ angle
            this.totalArmLength += bone.boneLength; // add to our total arm length
        }
        else {
            let endPoint = this.state.points[this.state.points.length-1];
            let endBone = this.state.bones[this.state.bones.length-1];
            let globalAngle = endBone.globalAngle + startingLocalAngle;
            let newX = bone.boneLength * Math.cos(globalAngle * this.DEG2RAD) + endPoint.getComponent(0),
                newY = bone.boneLength * Math.sin(globalAngle * this.DEG2RAD) + endPoint.getComponent(1);
            let newPoint = new THREE.Vector3(newX, newY, 0); // start every vector's z value as 0

            let boneAngleInfo = {globalAngle: globalAngle, localAngle: startingLocalAngle};
            this.state.points.push(newPoint); // append our point
            this.state.bones.push(Object.assign({}, bone, boneAngleInfo)); // append our new bone object w/ angle
            this.totalArmLength += bone.boneLength; // add to our total arm length
        }
    };

    /**
     * Clamps the value passed between the range of min to max
     * @example Fabrik.clamp(-5, 0, 10) // outputs 0
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
     */
    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    /**
     * Calculates & returns a new object of the new global & local angle of the current bone
     * @param {Vector3} newPosition - the new position of the current point
     * @param {Vector3} currentPoint - the current point without being updated to the new Position
     * @param {Vector3} prevPoint
     * @param {Object} currentBone - current bone without its updated angles
     * @param {Object} prevBone
     * @return {Object} - with properties "globalAngle" & "localAngle"
     */
    calculateNewAngles(newPosition, currentPoint, prevPoint, currentBone, prevBone) {
        let result = Object.assign({}, currentBone); // clone the currentBone's properties

        // now we can calculate the angles
        let v = newPosition;
        let u = currentPoint;
        let v_u = v.sub(u);

        let globalAngle = Math.atan2(v_u.getComponent(1), v_u.getComponent(0));
        globalAngle = globalAngle * this.RAD2DEG; // convert from radians to degrees

        let localAngle = globalAngle - prevBone.globalAngle;

        // result.globalAngle = globalAngle;
        // result.localAngle = localAngle;

        currentBone.globalAngle = globalAngle;
        currentBone.localAngle = localAngle;
        // return result;
    }


    checkAngleConstraints(currentIndex, newX, newY) {
        const points = this.state.points;
        const bones = this.state.bones;
        const currentBone = bones[currentIndex];
        const prevBone = bones[currentIndex-1];
        // finding the global & local angles
        let newPoint = new THREE.Vector3(newX, newY, 0);
        let v = newPoint.clone();
        let u = points[currentIndex];
        let v_u = v.sub(u);

        // constrain our points of v_u if we have to
        // if (currentBone.hasOwnProperty("constraints") && currentIndex === 2) {
        //     // find the min and max positions of the bone
        //     let minX, minY, maxX, maxY;
        //     let globalMinAngle = currentBone.constraints.min + prevBone.globalAngle;
        //     let globalMaxAngle = currentBone.constraints.max + prevBone.globalAngle;
        //
        //     minX = currentBone.boneLength * Math.cos(globalMinAngle * this.DEG2RAD) + points[currentIndex-1].getComponent(0);
        //     minY = currentBone.boneLength * Math.sin(globalMinAngle * this.DEG2RAD) + points[currentIndex-1].getComponent(1);
        //     maxX = currentBone.boneLength * Math.cos(globalMaxAngle * this.DEG2RAD) + points[currentIndex-1].getComponent(0);
        //     maxY = currentBone.boneLength * Math.sin(globalMaxAngle * this.DEG2RAD) + points[currentIndex-1].getComponent(1);
        //
        //     let minVector = new THREE.Vector3(minX, minY, 0);
        //     let maxVector = new THREE.Vector3(maxX, maxY, 0);
        //     console.log(points[currentIndex-1]);
        //     console.log(minVector);
        //     console.log(maxVector);
        //     // console.log(v_u);
        //
        //     v_u.clamp(minVector, maxVector);
        //
        //     // console.log(v_u);
        // }


        // calc angles wheter constrained or not
        let globalAngle = Math.atan2(v_u.getComponent(1), v_u.getComponent(0));
        globalAngle = globalAngle * this.RAD2DEG; // convert from radians to degrees


        // updating correct angles
        currentBone.globalAngle = globalAngle;
        if (currentIndex >= 1) {
            let localAngle = globalAngle - prevBone.globalAngle;

            if (currentBone.hasOwnProperty("constraints") && (localAngle < currentBone.constraints.min
                || localAngle > currentBone.constraints.max)) {
                console.log("Bone " + currentIndex + " going out of constraint bounds");

            }

            currentBone.localAngle = localAngle;
        }
        else if (currentIndex === 0) {
            currentBone.localAngle = globalAngle;
        }
    }

    /**
     * We assume that this bone has constraints
     * Directly modifies/clamps the point if the bone has constraints
     */
    clampPosition(newX, newY, bone, prevGlobalAngle=0, prevPoint=null) {
        // before we calculate any angles we need to honor bone constraints if there is any
        let minX, minY, maxX, maxY;
        let globalMinAngle = bone.constraints.min + prevGlobalAngle;
        let globalMaxAngle = bone.constraints.max + prevGlobalAngle;
        let prevX = (prevPoint) ? prevPoint.getComponent(0) : 0; // default to 0 if no prevPoint is passed
        let prevY = (prevPoint) ? prevPoint.getComponent(1) : 0; // default to 0 if no prevPoint is passed

        minX = bone.boneLength * Math.cos(globalMaxAngle * this.DEG2RAD) + prevX;
        minY = bone.boneLength * Math.sin(globalMinAngle * this.DEG2RAD) + prevY;

        maxX = bone.boneLength * Math.cos(globalMinAngle * this.DEG2RAD) + prevX;
        maxY = bone.boneLength * Math.sin(globalMaxAngle * this.DEG2RAD) + prevY;

        // finally clamping
        let clampedX = this.clamp(newX, minX, maxX);
        let clampedY = this.clamp(newY, minY, maxY);

        return {x: clampedX, y: clampedY};
    }

    /**
     * Loop from the end point to the base point
     */
    forwardReaching() {
        const points = this.state.points;
        const bones = this.state.bones;
        let delta, lambda, lambdaStar, newX, newY;
        for(let i = points.length-2; i > 0; i--) {
            // find calculations
            delta = points[i+1].distanceTo(points[i]);
            lambda = bones[i].boneLength / delta;
            lambdaStar = 1.0 - lambda;

            // update the points[i] position
            newX = (lambdaStar * points[i+1].getComponent(0)) + (lambda * points[i].getComponent(0));
            newY = (lambdaStar * points[i+1].getComponent(1)) + (lambda * points[i].getComponent(1));

            //constraining the first bone
            if (i === 0 && bones[i].hasOwnProperty("constraints")) {
                let clampedPoint;
                console.log(newX, newY);
                if (i === 0) {
                    // we don't need to pass in the global Angle and point0 since its just 0 for all of them
                    clampedPoint = this.clampPosition(newX, newY, bones[i]);

                    // else {
                    //     clampedPoint = this.clampPosition(newX, newY, bones[i], bones[i-1].globalAngle, points[i-1]);
                    // }

                    console.log(clampedPoint);
                    points[i].setComponent(0, clampedPoint.x);
                    points[i].setComponent(1, clampedPoint.y);
                }
            }
            else {
                points[i].setComponent(0, newX);
                points[i].setComponent(1, newY);
            }
        }
    }

    /**
     * Loop from the base point to the end point
     */
    backwardReaching() {
        // save the length value so it doesn't have to recalculate it on every iteration
        // since the array is expanded or shrinked in any way
        const points = this.state.points;
        const bones = this.state.bones;
        let delta, lambda, lambdaStar, newX, newY;
        for(let i = 0, length = points.length; i < length - 1; i++) {

            // find calculations
            delta = points[i + 1].distanceTo(points[i]);
            lambda = bones[i].boneLength / delta;
            lambdaStar = 1.0 - lambda;

            // update the points[i+1] position
            newX = (lambdaStar * points[i].getComponent(0)) + (lambda * points[i + 1].getComponent(0));
            newY = (lambdaStar * points[i].getComponent(1)) + (lambda * points[i + 1].getComponent(1));

            // I need to update the bone's global & local angle regardless if this point is out of range or not
            // If it is out of range then we can fix that if we have to constrain the new position
            // ...
            // if (i === 0) {
            //
            // }


            //constraining the first bone
            if (i === 0 && bones[i].hasOwnProperty("constraints")) {
                let clampedPoint;
                console.log(newX, newY);
                if (i === 0) {
                    // we don't need to pass in the global Angle and point0 since its just 0 for all of them
                    clampedPoint = this.clampPosition(newX, newY, bones[i]);

                // else {
                //     clampedPoint = this.clampPosition(newX, newY, bones[i], bones[i-1].globalAngle, points[i-1]);
                // }

                    console.log(clampedPoint);
                    points[i + 1].setComponent(0, clampedPoint.x);
                    points[i + 1].setComponent(1, clampedPoint.y);
                }
            }
            else {
                points[i + 1].setComponent(0, newX);
                points[i + 1].setComponent(1, newY);
            }
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
                lambda = bones[i].boneLength / delta;
                lambdaStar = 1.0 - lambda;

                // update the points[i+1] position
                newX = (lambdaStar * points[i].getComponent(0)) + (lambda * target.getComponent(0));
                newY = (lambdaStar * points[i].getComponent(1)) + (lambda * target.getComponent(1));

                //constraining the first bone
                if (bones[i].hasOwnProperty("constraints")) {
                    let clampedPoint;
                    console.log(newX, newY);
                    if (i === 0) {
                        // we don't need to pass in the global Angle and point0 since its just 0 for all of them
                        clampedPoint = this.clampPosition(newX, newY, bones[i]);
                    }
                    else {
                        clampedPoint = this.clampPosition(newX, newY, bones[i], bones[i-1].globalAngle, points[i-1]);
                    }

                    console.log(clampedPoint);
                    points[i + 1].setComponent(0, clampedPoint.x);
                    points[i + 1].setComponent(1, clampedPoint.y);
                }
                else {
                    points[i + 1].setComponent(0, newX);
                    points[i + 1].setComponent(1, newY);
                }
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

        // finally return the solved state of the bones and points
        return this.state;
    }
}

module.exports.Fabrik = Fabrik;

/**
 * For some reason the points when at max constraint will dip below it's max x or y. This causes the drawn line between
 * 2 points representing a bone to decrease in width. But regardless the angle of the bone will still be the same.
 * Either super close to maxAngle or minAngle. I'm talking decimal e^-14.
 * So what needs to happen is instead of drawing out the points and lines like im doing now. I should draw out rectangle
 * boxes with a defined height & width. This way the height/width never changes. Since in the end all I'm worried about
 * is the angle of what bone needs to rotate to then I don't have to worry about "acurracy" if the x,y decreases below
 * defined max constraints. Again in the end the angle will stay the same for up to 14 decimal places. Which is pretty
 * damn negligent for our system. At least I hope so...
 *
 * for example
 * atan2(286.1090133608492, 1.757368156776452e-14) = 89.999999999999996480719804972291 degrees
 * atan2(274.3865618635226, 1.757368156776452e-14) = 89.999999999999996330367720994381 degrees
 */