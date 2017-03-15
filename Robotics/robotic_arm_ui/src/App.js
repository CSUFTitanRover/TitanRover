import React, { Component } from 'react';
import './RoboticArm.css';
import Base from './arm_shapes/Base';
import arm_settings from './arm_settings.json';
import '../node_modules/antd/dist/antd.min.css';
import { Slider, InputNumber, Button } from 'antd';
import { Stage, Layer, Group, Rect, Circle, Text } from 'react-konva';
import Arm from './arm_shapes/Arm';

class App extends Component {
    constructor(props) {
        super(props);

        // init default values
        this.state = {
            boneOne: {
                angle: 0,
                group: {
                    x: 0,
                    y: 0
                }
            },
            boneTwo: {
                angle: 0,
                group: {
                    x: arm_settings.boneOne.width,
                    y: 0
                }
            }
        };

        this.stage = {
            width: 950,
            height: 600,
        };

        // bottom centering
        // this x & y are the base coordinates of "imaginary" cartesianal plane
        this.layer = {
            x: (this.stage.width/2 - arm_settings.base.width/2),
            y: (this.stage.height - arm_settings.base.height),
        };
    }

    onBoneOneChange = (value) => {
        const boneOne = this.state.boneOne;
        boneOne.angle = value;
        this.setState({boneOne});
    };

    // Hold on lemme get my mic

    onBoneTwoChange = (value) => {
        const boneTwo = this.state.boneTwo;
        boneTwo.angle = value;
        this.setState({boneTwo});
    };

    handleDragMoveTarget = (event) => {
        let mouse = {x: event.target.attrs.x, y: event.target.attrs.y};

        // flipping mouse.y coordinates to "cartesian"
        mouse.y *= -1;

        console.info(mouse.x, mouse.y);
        //
        // if (mouse.x > arm_settings.boneOne.height &&
        //     (mouse.y < arm_settings.boneOne.width &&
        //         mouse.y > -1 * (arm_settings.boneOne.width + arm_settings.boneTwo.width)
        //     )) {
        //
        // }

        let result = this.inverse_kinematics(mouse.x, mouse.y);
        // console.info(result);

        if (result) {

            // constraints ?!
            if (result.boneOneAngle < -90)
                result.boneOneAngle = -90;
            if (result.boneOneAngle > 0)
                result.boneOneAngle = 0;
            if (result.boneTwoAngle > 90)
                result.boneTwoAngle = 90;
            if (result.boneTwoAngle < 0)
                result.boneTwoAngle = 0;

            // stupid hack here for centering bone two
            result.boneTwoAngle -= 4;

            const boneOne = this.state.boneOne, boneTwo = this.state.boneTwo;
            boneOne.angle = result.boneOneAngle;
            boneTwo.angle = result.boneTwoAngle;
            this.setState({boneOne, boneTwo});
        }

    };


    // Given the XY, output the Thetas
    inverse_kinematics = (X,Y) => {
        // compensate for group offset of bones
        let l1 = arm_settings.boneOne.width - 15, l2 = arm_settings.boneTwo.width - 15;

        let c2 = (Math.pow(X,2) + Math.pow(Y,2) - Math.pow(l1,2) - Math.pow(l2,2))/(2*l1*l2);
        let s2 =  Math.sqrt(1 - Math.pow(c2,2));
        let THETA2D = -Math.atan2(s2, c2); // theta2 is deduced

        let k1 = l1 + l2*Math.cos(THETA2D);
        let k2 = l2*(Math.sin(THETA2D));
        let gamma = Math.atan2(k2, k1);
        let THETA1D =  Math.atan2(Y, X) - gamma; // Theta 1 deduced

        THETA1D = -1 * (THETA1D) * (180 / Math.PI);
        THETA2D = -1 * (THETA2D) * (180 / Math.PI);

        if (THETA1D && THETA2D) {
            // hard coding in constraints
            return {boneOneAngle: THETA1D, boneTwoAngle: THETA2D};
        }
        return null;
    };

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // initially set the target's x position to the tip of the arm
    componentDidMount() {
        this.refs.target.x(390);
    }

    render() {
        return (
            <div>

                <h1>Inverse Kinematics - 2 DOF</h1>
                <Stage width={this.stage.width} height={this.stage.height}>
                    {/* This is just to draw a border around our drawing canvas Stage */}
                    <Layer>
                        <Rect width={this.stage.width} height={this.stage.height}
                              stroke={4} strokeFill="black" dash={[10, 5]} />
                    </Layer>

                    {/* Actual drawn elements */}
                    <Layer x={this.layer.x * 0.75} y={this.layer.y * 0.75}>

                        <Base width={arm_settings.base.width} height={arm_settings.base.height}/>

                        <Arm armState={this.state} />


                        {/*Our End Target*/}
                        <Group onDragMove={this.handleDragMoveTarget} ref="target" draggable={true} offsetX={-arm_settings.base.width / 2}>
                            <Circle width={20} height={20} fill="red" />
                            <Text
                                x={15} y={-20}
                                text="Drag Me"
                                fontSize={14}
                                fill="red"
                            />
                            <Rect width={75} height={3} x={0} y={0} fill="red"/>
                        </Group>

                    </Layer>
                </Stage>

                <div id="controls">
                    <div>
                        <h3>Bone One Degree Values</h3>
                        <Slider min={-90} max={0} step={0.01} value={this.state.boneOne.angle} onChange={this.onBoneOneChange} />
                        <InputNumber min={-90} max={0} step={0.01} value={this.state.boneOne.angle} onChange={this.onBoneOneChange}/>
                    </div>

                    <div>
                        <h3>Bone Two Degree Values</h3>
                        <Slider min={0} max={90} step={0.01} value={this.state.boneTwo.angle} onChange={this.onBoneTwoChange} />
                        <InputNumber min={0} max={90} step={0.01} value={this.state.boneTwo.angle} onChange={this.onBoneTwoChange}/>
                    </div>
                </div>

            </div>
        );

    }
}

export default App;
