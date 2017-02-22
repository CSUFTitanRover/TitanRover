import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import Konva from 'konva';
import {Layer, Rect, Stage} from 'react-konva';

class ArmControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: 'green'
        }
    }

    handleClick = () => {
        let newColor = Konva.Util.getRandomColor();
        this.setState({color: newColor});
    };

    render() {
        return (
            <BaseModuleTemplate moduleName="Arm Control">
                <p>
                    We plan to have arm control as in the gif below. This will include 1 to 1 control as well as Inverse
                    Kinematics if we get it working.
                </p>
                <img src="http://www.alistairwick.com/assets/images/robot/ik.gif"/>

                <Stage width={700} height={700}>
                    <Layer>
                        <Rect
                            x={10} y={10} width={50} height={50}
                            fill={this.state.color}
                            onClick={this.handleClick}
                            draggable={true}
                        />
                    </Layer>
                </Stage>
            </BaseModuleTemplate>
        );
    }
}

export default ArmControl;