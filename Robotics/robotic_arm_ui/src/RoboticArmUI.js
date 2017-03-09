import React, { Component } from 'react';
import './RoboticArmUI.css';
import Base from './arm_shapes/Base';
import arm_settings from './arm_settings.json';
import '../node_modules/antd/dist/antd.min.css';
import { Slider, InputNumber } from 'antd';
import { Stage, Layer, Group, Rect, Circle, Text } from 'react-konva';
import math from 'mathjs';

class RoboticArmUI extends Component {
    constructor(props) {
        super(props);

        // init default values
        this.state = {
            boneOne: {
                rotation: 0,
                group: {
                    x: 0,
                    y: 0
                }
            },
            boneTwo: {
                rotation: 0,
                group: {
                    x: arm_settings.boneOne.width,
                    y: 0
                }
            }
        };

        // width & height of our base
        this.baseWidth = 150;
        this.baseHeight = 30;

        this.stage = {
            width: 1000,
            height: 700,
        };

        // bottom centering
        // this x & y are the base coordinates of "imaginary" cartesianal plane
        this.layergroup = {
            x: (this.stage.width/2 - this.baseWidth/2),
            y: (this.stage.height - this.baseHeight),
        };
    }

    onBoneOneChange = (value) => {
        const boneOne = this.state.boneOne;
        boneOne.rotation = value;
        this.setState({boneOne});

        const b = this.refs.boneOne;
        b.to({
            rotation: value,
            duration: 0.3
        });
    };

    onBoneTwoChange = (value) => {
        const boneTwo = this.state.boneTwo;
        boneTwo.rotation = value;
        this.setState({boneTwo});

        const b = this.refs.boneTwo;
        b.to({
            rotation: value,
            duration: 0.3
        });
    };

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ignore this... just to randomly move both joints
    // componentDidMount() {
    //     const boneOne = this.state.boneOne, boneTwo = this.state.boneTwo;
    //     boneOne.rotation = this.getRandomIntInclusive(-90, 0);
    //     boneTwo.rotation = this.getRandomIntInclusive(0, 90);
    //
    //     this.setState({boneOne, boneTwo});
    //
    //     this.incOne = -0.1, this.incTwo = -0.1;
    //     setInterval( () => {
    //
    //         if (this.state.boneOne.rotation > 0 || this.state.boneOne.rotation < -90)
    //             this.incOne *= -1;
    //
    //         if (this.state.boneTwo.rotation > 90 || this.state.boneTwo.rotation < 0)
    //             this.incTwo *= -1;
    //
    //         const boneOne = this.state.boneOne,
    //             boneTwo = this.state.boneTwo;
    //
    //         boneOne.rotation += this.incOne;
    //         boneTwo.rotation += this.incTwo;
    //
    //         // const b1 = this.refs.boneOne;
    //         // b1.to({
    //         //     rotation: boneOne.rotation,
    //         //     duration: 0.3
    //         // });
    //         //
    //         // const b2 = this.refs.boneTwo;
    //         // b2.to({
    //         //     rotation: boneTwo.rotation,
    //         //     duration: 0.3
    //         // });
    //
    //         this.setState({boneOne, boneTwo});
    //
    //     }, 0.01);
    // }

    handleDragMoveTarget = (event) => {
        let mouse = {x: event.target.attrs.x, y: event.target.attrs.y};

        // flipping mouse.y coordinates to "cartesian"
        mouse.y *= -1;

        if (mouse.x < 0 || mouse.x > 390)
            return;

        console.info(mouse.x, mouse.y);

        let result = this.inverse_kinematics(mouse.x, mouse.y);
        console.info(result);

        if (result) {
            const b1 = this.refs.boneOne, b2 = this.refs.boneTwo;
            b1.to({
                rotation: result.boneOneAngle,
                duration: 0.3
            });
            b2.to({
                rotation: result.boneTwoAngle,
                duration: 0.3
            });
        }
    };


    // Given the XY, output the Thetas
    inverse_kinematics = (X,Y) => {
        let l1 = arm_settings.boneOne.width, l2 = arm_settings.boneTwo.width;

        let c2 = (Math.pow(X,2) + Math.pow(Y,2) - Math.pow(l1,2) - Math.pow(l2,2))/(2*l1*l2);
        let s2 =  Math.sqrt(1 - Math.pow(c2,2));
        let THETA2D = -math.atan2(s2, c2); // theta2 is deduced

        let k1 = l1 + l2*math.cos(THETA2D);
        let k2 = l2*(math.sin(THETA2D));
        let gamma = math.atan2(k2, k1);
        let THETA1D =  math.atan2(Y, X) - gamma; // Theta 1 deduced

        if (THETA1D || THETA2D)
            return {boneOneAngle: THETA1D * -90, boneTwoAngle: THETA2D * -90};
        else
            return null;
    };

    // initially set the target's x position to the tip of the arm
    componentDidMount() {
        this.refs.target.x(390);
    }

    render() {

        return (
            <div>
                <div>
                    <h3>Bone One Values</h3>
                    <Slider min={-90} max={0} step={0.01} value={this.state.boneOne.rotation} onChange={this.onBoneOneChange} />
                    <InputNumber min={-90} max={0} step={0.01} value={this.state.boneOne.rotation} onChange={this.onBoneOneChange}/>
                </div>

                <div>
                    <h3>Bone Two Values</h3>
                    <Slider min={0} max={90} step={0.01} value={this.state.boneTwo.rotation} onChange={this.onBoneTwoChange} />
                    <InputNumber min={0} max={90} step={0.01} value={this.state.boneTwo.rotation} onChange={this.onBoneTwoChange}/>
                </div>

                <Stage width={this.stage.width} height={this.stage.height}>
                    {/* This is just to draw a border around our drawing canvas Stage */}
                    <Layer>
                        <Rect width={this.stage.width} height={this.stage.height}
                              stroke={4} strokeFill="black" dash={[10, 5]} />
                    </Layer>

                    {/* Actual drawn elements */}
                    <Layer >
                        <Group x={this.layergroup.x} y={this.layergroup.y * 0.75}>
                            <Base width={this.baseWidth} height={this.baseHeight}/>

                            {/*Bone One*/}
                            <Group x={this.baseWidth / 2} ref="boneOne"
                                   offsetX={15} offsetY={arm_settings.boneOne.height / 2}
                            >
                                <Circle width={10} height={10} fill="orange" x={15} y={arm_settings.boneOne.height / 2}/>
                                <Rect
                                    x={0} y={0}
                                    offsetX={0} offsetY={0}
                                    width={arm_settings.boneOne.width} height={arm_settings.boneOne.height}
                                    fill="rgba(0, 255, 4, 0.5)"
                                />
                                <Text
                                    x={arm_settings.boneOne.width / 2 - 35} y={8}
                                    text="Bone One"
                                    fontSize={18}
                                    fill="darkgreen"
                                />

                                {/*Bone Two*/}
                                <Group ref="boneTwo" x={this.state.boneTwo.group.x - 15} y={arm_settings.boneTwo.height / 2}
                                       offsetX={15} offsetY={arm_settings.boneTwo.height / 2}
                                >
                                    <Circle width={10} height={10} fill="orange" x={15} y={arm_settings.boneTwo.height / 2}/>
                                    <Rect
                                        x={0} y={0}
                                        offsetX={0} offsetY={0}
                                        width={arm_settings.boneTwo.width} height={arm_settings.boneTwo.height}
                                        fill="rgba(0, 187, 255, 0.5)"
                                    />

                                    <Text
                                        x={arm_settings.boneTwo.width / 2 - 30} y={8}
                                        text="Bone Two"
                                        fontSize={18}
                                        fill="darkblue"
                                    />
                                </Group>
                            </Group>

                            {/*Our End Target*/}
                            <Circle width={20} height={20} fill="red" draggable={true}
                                    offsetX={-this.baseWidth / 2}
                                    onDragMove={this.handleDragMoveTarget}
                                    ref="target"
                            />

                        </Group>
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default RoboticArmUI;
