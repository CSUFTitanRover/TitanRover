import React, { Component } from 'react';
import BoneOne from './BoneOne'

// just a crude wrapper for the entire arm
// the arm is organized in a child relationship like a linked-list
// bone1 -> bone2 -> bone3
class Arm extends Component {
    render() {
        return (
            <BoneOne armState={this.props.armState} setArmState={this.props.setArmState}/>
        );
    }
}

export default Arm;
