import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';

class ArmControl extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Arm Control">
                <p>
                    We plan to have arm control as in the gif below. This will include 1 to 1 control as well as Inverse
                    Kinematics if we get it working.
                </p>
                <img src="http://www.alistairwick.com/assets/images/robot/ik.gif"/>
            </BaseModuleTemplate>
        );
    }
}

export default ArmControl;