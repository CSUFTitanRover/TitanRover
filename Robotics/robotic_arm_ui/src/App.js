import React, { Component } from 'react';
import './App.css';
import Base from './arm_shapes/Base';
import arm_settings from './arm_settings.json';
import '../node_modules/antd/dist/antd.min.css';
// import { Slider, InputNumber } from 'antd';
import { Stage, Layer, Group, Rect, Circle, Text, Line } from 'react-konva';
import { Fabrik } from './Fabrik';

class App extends Component {
    constructor(props) {
        super(props);

        this.fabrik = new Fabrik();
        const fabrik = this.fabrik;
        fabrik.addBone(arm_settings.d0.length);
        fabrik.addBone(arm_settings.d1.length);
        fabrik.addBone(arm_settings.d2.length);

        // init default values
        this.state = {
            p0: {
                x: 0,
                y: 0
            },
            p1: {
                x: fabrik.points[1].x,
                y: fabrik.points[1].y
            },
            p2: {
                x: fabrik.points[2].x,
                y: fabrik.points[2].y
            },
            p3: {
                x: fabrik.points[3].x,
                y: fabrik.points[3].y
            },
            target: {
                x: fabrik.points[3].x,
                y: fabrik.points[3].y * -1,
            }
        };

        this.stage = {
            width: 1200,
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

    onBoneTwoChange = (value) => {
        const boneTwo = this.state.boneTwo;
        boneTwo.angle = value;
        this.setState({boneTwo});
    };

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // initially set the target's x position to the tip of the arm
    componentDidMount() {
        // let i = 0;
        // setInterval( () => {
        //     const p2 = {
        //         x: Math.cos(i) * 180/Math.PI,
        //         y: Math.sin(i) * 180/Math.PI
        //     };
        //     i += 1;
        //     this.setState({p2})
        // }, 200);
    }

    handleDragMove = (event) => {
        let target = {x: event.target.attrs.x, y: event.target.attrs.y};

        // flipping mouse.y coordinates to "cartesian"
        target.y *= -1;

        // solvedPoints will be an array of type Victor Objects
        let solvedPoints = this.fabrik.solveIK(target.x, target.y);

        const newState = this.state;
        for(let i = 1, length = solvedPoints.length; i < length; i++) {
            // dynamically updating all the States' points with the New Points
            newState["p" + i].x = solvedPoints[i].x;
            newState["p" + i].y = solvedPoints[i].y * -1; // this is to convert from cartesianal to gui coordiantes
        }

        // just to update the circle targets new (x, y). Don't worry about this.
        newState.target.x = target.x;
        newState.target.y = target.y * -1;

        this.setState(newState);
    };

    setArmState = (newState) => {
        this.setState(newState);
    };

    render() {
        return (
            <div>
                <h1>Inverse Kinematics - Unconstrained 3 DOF</h1>
                <Stage width={this.stage.width} height={this.stage.height}>
                    {/* This is just to draw a border around our drawing canvas Stage */}
                    <Layer>
                        <Rect width={this.stage.width} height={this.stage.height}
                              stroke="black" strokeWidth={3} dash={[10, 5]} />
                    </Layer>

                    {/* Actual drawn elements */}
                    <Layer x={this.layer.x * 0.75} y={this.layer.y * 0.75}>

                        <Base width={arm_settings.base.width} height={arm_settings.base.height}/>

                        <Group offsetX={-arm_settings.base.width / 2}>

                            {/*Point 1*/}
                            <Circle x={this.state.p0.x} y={this.state.p0.y} width={10} fill="rgba(0,255,0,0.7)"/>

                            {/*Line between Point 0 and Point 1*/}
                            <Line stroke="black" strokeWidth={3}
                                  points={[
                                      this.state.p0.x, this.state.p0.y,
                                      this.state.p1.x, this.state.p1.y
                                  ]}
                            />

                            {/*Point 2*/}
                            <Circle x={this.state.p1.x} y={this.state.p1.y} width={10} fill="rgba(0,0,255,0.7)"/>

                            {/*Line between Point 1 and Point 2*/}
                            <Line stroke="black" strokeWidth={3}
                                  points={[
                                      this.state.p1.x, this.state.p1.y,
                                      this.state.p2.x, this.state.p2.y,
                                  ]}
                            />

                            {/*Point 3*/}
                            <Circle x={this.state.p2.x} y={this.state.p2.y} width={10} fill="rgba(255,255,0,0.7)"/>

                            {/*Line between Point 2 and Point 3*/}
                            <Line stroke="black" strokeWidth={3}
                                  points={[
                                      this.state.p2.x, this.state.p2.y,
                                      this.state.p3.x, this.state.p3.y,
                                  ]}
                            />

                            {/*Point 3*/}
                            <Circle x={this.state.p3.x} y={this.state.p3.y} width={10} fill="rgba(90,90,90,0.7)"/>

                            {/*Our End Target*/}
                            <Circle width={20} height={20} fill="rgba(255,0,0,0.7)"
                                    ref="target" draggable={true}
                                    x={this.state.target.x} y={this.state.target.y}
                                    onDragMove={this.handleDragMove}
                                    onMouseOver={() => {document.body.style.cursor = "move"}}
                                    onMouseOut={() => {document.body.style.cursor = "default"}}
                            />

                        </Group>

                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default App;

/*
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
*/
