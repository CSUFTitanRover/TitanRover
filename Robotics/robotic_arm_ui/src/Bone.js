// to be used with Fabrik

const THREE = require('three');

class Bone {
    /**
     * Constructor for Bone
     * @param {Vector3} positionVector
     * @param {Bone} [parent=null] - Parent bone
     * @param {Bone} [child=null] - Child bone
     * @param {Number} [boneLength=null] - length of bone
     * @param {Number}localAngle - Expeceted in Degrees. The bone's global angle with respect to its parent angle
     * @param {Number}localAngle - Expeceted in Degrees. The bone's local angle.
     */
    constructor(positionVector, parent=null, child=null, boneLength=null, globalAngle=0, localAngle=0) {
        this.position = positionVector;
        this.parent = parent;
        this.child = child;
        this.boneLength = boneLength;
        this.globalAngle = globalAngle;
        this.localAngle = localAngle;

        this.updateLocalAngle = this.updateLocalAngle.bind(this);
    }

    set x(newX) {
        this.position.setComponent(0, newX);
    }
    set y(newY) {
        this.position.setComponent(1, newY);
    }
    set z(newZ) {
        this.position.setComponent(2, newZ);
    }

    get x() {
        return this.position.getComponent(0);
    }
    get y() {
        return this.position.getComponent(1);
    }
    get z() {
        return this.position.getComponent(2);
    }

    getEndPoint(globalAngle) {
        let x = this.boneLength * Math.cos(globalAngle * this.DEG2RAD) + this.x;
        let y = this.boneLength * Math.sin(globalAngle * this.DEG2RAD) + this.y;
        return {x: x, y: y}
    }

    /**
     * Checks if this current bone has a child
     */
    hasChild() {
        return (this.child !== null);
    }

    isEndBone() {
        return this.hasChild() === false;
    }

    isBaseBone() {
        return this.hasChild() && this.parent === null;
    }

    /**
     * Used for 1-to-1 joint control of individual bone
     * @param newAngle
     */
    updateLocalAngle(newAngle) {
        // this takes into account that newAngle can be positive or negative
        this.localAngle = this.parent.localAngle + newAngle;
    }

}

module.exports.Bone = Bone;