const THREE = require('three');
const { Bone } = require('./Bone');

class Fabrik {
    /**
     * Constructor takes in an optional errorTolerance and optional maxAttemptsToSolve.
     * @param {Number} [errorTolerance = 0.0001] - Defines the allowed error when solving. Defaults to 0.001 if no value is supplied.
     * @param {Number} [maxAttemptsToSolve = 15] - Defines the max number of attempts to solve for. Defaults to 15 if no value is supplied.
     */
    constructor(errorTolerance = 0.001, maxAttemptsToSolve = 15) {
        // this.basePoint = new THREE.Vector3(0, 0, 0); // different then baseBone; this is just the point of origin (0,0,0)
        this.baseBone = null; // pointer baseBone
        this.endBone = null; // pointer endBone

        this.totalArmLength = 0;
        this.errorTolerance = errorTolerance;
        this.maxAttemptsToSolve = maxAttemptsToSolve;
        this.RAD2DEG = (180 / Math.PI); // cache for use later on
        this.DEG2RAD = (Math.PI / 180); // cache for use later on

        this.addBone = this.addBone.bind(this);
    }

    /**
     * Appends a bone to the chain.
     * @param {Object} bone - An object with properties "length" & "constraints"
     * @param {Number} [startingLocalAngle = 0] - Expected value to be in degrees. Defaults to 0 degrees if no value is passed.
     */
    addBone(bone, startingLocalAngle=0) {
        if (this.baseBone === null) {
            // this is going to be the first bone in the chain
            let positionVector = new THREE.Vector3(0, 0, 0);
            let parent = null;
            let child = null;
            let globalAngle = startingLocalAngle, localAngle = startingLocalAngle;
            let newBone = new Bone(positionVector, parent, child, bone.length, globalAngle, localAngle);
            this.baseBone = newBone; // point the starting bone newBone
            this.endBone = newBone; // point the end bone to the newBone
            this.totalArmLength += bone.length;
        }
        else {
            // this is not the first bone in the chain
            let globalAngle = startingLocalAngle + this.endBone.globalAngle;
            const endBonePoints = this.endBone.getEndPoint(globalAngle);
            let x = bone.length * Math.cos(globalAngle * this.DEG2RAD) + endBonePoints.x;
            let y = bone.length * Math.sin(globalAngle * this.DEG2RAD) + endBonePoints.y;
            let positionVector = new THREE.Vector3(x, y, 0);

            let parent = this.endBone;
            let child = null;
            let localAngle = startingLocalAngle;
            let newBone = new Bone(positionVector, parent, child, bone.length, globalAngle, localAngle);

            this.endBone.child = newBone; // update the current endBone's child
            this.endBone = newBone; // update the endBone pointer itself
        }
    }

    /**
     * Solves IK via FABRIK Algorithm
     * @param {Number} targetX - X coordinate of target
     * @param {Number} targetY - Y coordinate of target
     * @return {Object} - returns an Object with "points" {Array of Vector3} & "bones" {Array of Objects}
     */
    solveIK(targetX, targetY) {

        let target = new THREE.Vector3(targetX, targetY, 0);
        let totalArmLengthSq = this.totalArmLength * this.totalArmLength;

        // First check if the target is out of reach
        // this means that the distance from the target to pointZero is greater
        // then the sum of all the bone lengths (which is the Max Reach)

        if (this.baseBone.position.distanceToSquared(target) > totalArmLengthSq) {
            // The Target is unreachable so let's stretch all of the bones in a single line pointing towards the target.

            // we iterate from the baseBone to the endbone
            let delta, lambda, lambdaStar, newX, newY;
            let currentBone = this.baseBone;
            let childBone; // just used for calculations
            while(currentBone.hasChild()) {

                delta = target.distanceTo(currentBone.position);
                lambda = currentBone.boneLength / delta;
                lambdaStar = 1.0 - lambda;

                // update the child's position vector
                newX = (lambdaStar * currentBone.x) + (lambda * target.x);
                newY = (lambdaStar * currentBone.y) + (lambda * target.y);
                currentBone.child.x = newX;
                currentBone.child.y = newY;

                // update & point to the child
                currentBone = currentBone.child;
            }
        }
        else {

        }
    }

}

module.exports.Fabrik = Fabrik;


let fabrik = new Fabrik();
fabrik.addBone({length: 10}, 45);
fabrik.addBone({length: 10}, 0);
fabrik.addBone({length: 10}, 90);

let currentBone = fabrik.baseBone;
while(currentBone) {
    console.log(currentBone.position);
    console.log(currentBone.localAngle);
    console.log(currentBone.globalAngle);
    console.log();
    currentBone = currentBone.child;
}

console.log('Solving Ik...\n');
fabrik.solveIK(31, 0);

currentBone = fabrik.baseBone;
while(currentBone) {
    console.log(currentBone.position);
    console.log(currentBone.localAngle);
    console.log(currentBone.globalAngle);
    console.log();
    currentBone = currentBone.child;
}
