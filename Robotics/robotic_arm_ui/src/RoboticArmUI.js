import React, { Component } from 'react';
import './RoboticArmUI.css';
import { Stage, Layer, Rect, Group } from 'react-konva';
import Base from './arm_shapes/Base';
import JointOne from './arm_shapes/JointOne';

class RoboticArmUI extends Component {
    constructor(props) {
        super(props);

        // width & height of our base
        this.baseWidth = 150;
        this.baseHeight = 30;

        this.stage = {
            width: 1000,
            height: 700,
        };

        this.group = {
            offsetX: (this.stage.width/2 - this.baseWidth/2) * -1,
            offsetY: (this.stage.height - this.baseHeight) * -1,
        };
    }

    render() {

        return (
            <Stage width={this.stage.width} height={this.stage.height}>

                {/* This is just to draw a border around our drawing canvas Stage */}
                <Layer>
                    <Rect width={this.stage.width} height={this.stage.height}
                          stroke={4} strokeFill="black" dash={[10, 5]} />
                </Layer>

                {/* Actual drawn elements */}
                <Layer>
                    <Group offsetX={this.group.offsetX} offsetY={this.group.offsetY}>
                        <Base width={this.baseWidth} height={this.baseHeight}/>
                        <JointOne x={this.baseWidth/2} group={this.group}/>
                    </Group>
                </Layer>
            </Stage>
        );
    }
}

export default RoboticArmUI;
