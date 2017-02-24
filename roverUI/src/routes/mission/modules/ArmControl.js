import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import Konva from 'konva';
import {Stage, Layer, Circle, Rect} from 'react-konva';

class ArmControl extends Component {
    constructor(props) {
        super(props);

        this.stageSize = 700;

        this.state = {
            color: 'green',
            y: this.stageSize / 2,
            x: this.stageSize / 2,
        };


    }

    handleClick = () => {
        let newColor = Konva.Util.getRandomColor();
        this.setState({color: newColor});
    };

    handleMouseMove = () => {
        let stage = this.refs.stage.getStage();
        let mousePos = stage.getPointerPosition();
        this.setState(mousePos);
    };

    render() {
        let size = 100;
        return (
            <BaseModuleTemplate moduleName="Arm Control">
                <p>
                    We plan to have arm control as in the gif below. This will include 1 to 1 control as well as Inverse
                    Kinematics if we get it working.
                </p>
                <img src="http://www.alistairwick.com/assets/images/robot/ik.gif"/>

                <Stage ref="stage" width={this.stageSize} height={this.stageSize} >
                    <Layer fill="orange">
                        <Rect x={0} y={0} width={this.stageSize} height={this.stageSize}
                              stroke="black" strokeWidth={3}
                        />
                        <Circle
                            x={this.state.x} y={this.state.y} width={size} height={size}
                            fill={this.state.color}
                            onClick={this.handleClick}
                            onMouseMove={this.handleMouseMove}
                            stroke="black" strokeWidth={3}
                        />
                    </Layer>
                </Stage>
            </BaseModuleTemplate>
        );
    }
}

export default ArmControl;