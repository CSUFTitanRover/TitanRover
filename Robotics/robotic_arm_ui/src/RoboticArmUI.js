import React, { Component } from 'react';
import './RoboticArmUI.css';
import { Stage, Layer, Rect, Group } from 'react-konva';
import Base from './arm_shapes/Base';
import Joint from './arm_shapes/Joint';
import arm_settings from './arm_settings.json';
import '../node_modules/antd/dist/antd.min.css';
import { Slider, InputNumber } from 'antd';

class RoboticArmUI extends Component {
    constructor(props) {
        super(props);

        // init default values
        this.state = {
            jointOne: {
                rotation: 180,
                group: {
                    x: 0,
                    y: 0
                }
            },
            jointTwo: {
                rotation: 180,
                group: {
                    x: arm_settings.jointOne.width,
                    y: 0
                }
            }
        };

        // width & height of our base
        this.baseWidth = 150;
        this.baseHeight = 30;

        this.stage = {
            width: 1000,
            height: 500,
        };

        // bottom centering
        // this x & y are the base coordinates of "imaginary" cartesianal plane
        this.layergroup = {
            x: (this.stage.width/2 - this.baseWidth/2),
            y: (this.stage.height - this.baseHeight),
        };
    }

    parentSetState = (newState) => {
        this.setState(newState);
    };

    onChange = (value) => {
        const jointOne = this.state.jointOne;
        jointOne.rotation = value;
        // this.setState({jointOne});

        const jo = this.refs.jointOne.refs.rect;
        let abstrn = jo.getClientRect();

        console.info(abstrn);

        const jointTwo = this.state.jointTwo;
        jointTwo.group.x = (abstrn.x + abstrn.width - 10);
        jointTwo.group.y = (abstrn.y + arm_settings.jointTwo.height/2);
        this.setState({jointOne, jointTwo});

    };

    // (this.layergroup.x + this.arm_settings.jointOne.width)

    componentDidMount() {
        // this.inc = -0.01;
        // setInterval( () => {
        //
        //     if (this.state.inputValue > 360 || this.state.inputValue < 0)
        //         this.inc *= -1;
        //
        //    this.setState({inputValue: this.state.inputValue+this.inc});
        // }, 0.01);
    }

    render() {

        return (
            <div>
                <Slider min={90} max={180} step={0.01} value={this.state.jointOne.rotation} onChange={this.onChange} />
                <InputNumber min={90} max={180} step={0.01} value={this.state.jointOne.rotation} onChange={this.onChange}/>

                <Stage width={this.stage.width} height={this.stage.height}>
                    {/* This is just to draw a border around our drawing canvas Stage */}
                    <Layer>
                        <Rect width={this.stage.width} height={this.stage.height}
                              stroke={4} strokeFill="black" dash={[10, 5]} />
                    </Layer>

                    {/* Actual drawn elements */}
                    <Layer>
                        <Group x={this.layergroup.x} y={this.layergroup.y}>
                            <Base width={this.baseWidth} height={this.baseHeight}/>

                            <Group x={this.baseWidth / 2}>
                                <Joint ref="jointOne" name="jointOne"
                                       groupX={this.state.jointOne.group.x} groupY={this.state.jointOne.group.y}
                                       rotation={this.state.jointOne.rotation}
                                       width={arm_settings.jointOne.width} height={arm_settings.jointOne.height}
                                       fill="rgba(0, 255, 4, 0.7)" parentSetState={this.parentSetState}
                                />
                                <Joint ref="jointTwo" name="jointTwo"
                                       groupX={this.state.jointTwo.group.x} groupY={this.state.jointTwo.group.y}
                                       rotation={this.state.jointTwo.rotation}
                                       width={arm_settings.jointTwo.width} height={arm_settings.jointTwo.height}
                                       fill="rgba(0, 153, 255, 0.5)" parentSetState={this.parentSetState}
                                />
                            </Group>
                        </Group>
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default RoboticArmUI;
