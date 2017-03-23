import React, { Component } from 'react';
import './App.css';
import Base from './arm_shapes/Base';
import arm_settings from './arm_settings.json';
import '../node_modules/antd/dist/antd.min.css';
import { Slider, InputNumber } from 'antd';
import { Stage, Layer, Group, Rect, Circle, Text, Line } from 'react-konva';
import Konva from 'konva';
import { Fabrik } from './Fabrik';

class App extends Component {
    constructor(props) {
        super(props);

        this.fabrik = new Fabrik();
        const fabrik = this.fabrik;
        // fabrik.addBone(arm_settings.bone1);
        // fabrik.addBone(arm_settings.bone2);
        // fabrik.addBone(arm_settings.bone3);

        // For Demo purposes
        let numberOfBones = 10;
        for(let i = 0; i < numberOfBones; i++) {
            fabrik.addBone( {
                    "length": 50
            });
        }

        let initialPoints = {}, initialBones = {};
        for(let i = 0, length = fabrik.state.points.length; i < length; i++) {
            // dynamically set all the States' points with the New Points
            initialPoints["p" + i] = {
                x: fabrik.state.points[i].getComponent(0),
                y: fabrik.state.points[i].getComponent(1) * -1, // this is to convert from cartesianal to gui coordiantes
            };

            // make sure we don't go out of bounds for the bones & accidentally create a new bone(N+1) object
            if (i < length - 1) {
                initialBones["bone" + (i + 1)] = fabrik.state.bones[i];
            }
        }

        // init default values
        this.state = Object.assign({},
            initialPoints,
            initialBones,
            {
                target: {
                    x: fabrik.state.points[fabrik.state.points.length - 1].x,
                    y:fabrik.state.points[fabrik.state.points.length - 1].y * -1
                }
            }
        );

        this.stage = {
            width: 1200,
            height: 700,
        };

        // bottom centering
        // this x & y are the base coordinates of "imaginary" cartesianal plane
        this.layer = {
            x: (this.stage.width/2 - arm_settings.base.width/2),
            y: (this.stage.height - arm_settings.base.height),
        };
    }

    handleDragMove = (event) => {
        let target = {x: event.target.attrs.x, y: event.target.attrs.y};

        // flipping mouse.y coordinates to "cartesian"
        target.y *= -1;

        // result will be an Object of "points" {Array of Vector3} & "bones" {Array of Objects}
        let result = this.fabrik.solveIK(target.x, target.y);

        const newState = this.state;
        for(let i = 1, length = result.points.length; i < length; i++) {
            // updating the respective bone's angle
            // we subtract i-1 because the bones [] starts at 0
            newState["bone" + i].angle = result.bones[(i - 1)].angle;

            // we use just i because we don't care about the first point which is (0,0,0)
            // dynamically updating all the States' points with the New Points
            newState["p" + i].x = result.points[i].getComponent(0);
            newState["p" + i].y = result.points[i].getComponent(1) * -1; // this is to convert from cartesianal to gui coordiantes
        }

        // just to update the circle target's new (x, y). Don't worry about this.
        newState.target.x = target.x;
        newState.target.y = target.y * -1;

        this.setState(newState);
    };

    componentWillMount() {
        // Save randomly generated colors for the renderPoints
        this.randomColors = [];

        for(let i=0, length=this.fabrik.state.points.length; i < length; i++) {
            this.randomColors.push(Konva.Util.getRandomColor());
        }
    }

    render() {
        let renderPoints = [], renderBones = [], renderGrids = [];
        // let demoControls = []; // for demo purposes
        for(let i=0, length=this.fabrik.state.points.length; i < length; i++) {
            renderPoints.push(
                <Circle x={this.state["p" + i].x} y={this.state["p" + i].y}
                        width={15} fill={this.randomColors[i]} key={i}
                />
            );

            // make sure we don't go out of bounds
            if (i < length - 1) {
                renderBones.push(
                    <Line stroke="rgb(170,170,170)" strokeWidth={5} key={i}
                          points={[
                              this.state["p" + i].x, this.state["p" + i].y,
                              this.state["p" + (i + 1)].x, this.state["p" + (i + 1)].y
                          ]}
                    />
                );
            }

            // // y-grids
            // renderGrids.push(
            //   <Rect x={this.state["p" + i].x} y={-this.stage.height + arm_settings.base.height}
            //         width={2} height={this.stage.height}
            //         fill={this.randomColors[i]}
            //   />
            // );
            //
            // //x-grids
            // renderGrids.push(
            //     <Rect x={-this.stage.width/2} y={this.state["p" + i].y}
            //           width={this.stage.width} height={2}
            //           fill={this.randomColors[i]}
            //     />
            // );

            // For demo purposes
            // ignore the first point (base point) since its just (0,0)
            // if (i !== 0) {
            //     demoControls.push(
            //         <div key={i}>
            //             <h3>Bone {i-1} Degree Values</h3>
            //             <Slider min={-360} max={360} step={0.01} value={this.state["p" + i].angle} />
            //             <InputNumber min={-360} max={360} step={0.01} value={this.state["p" + i].angle}/>
            //         </div>
            //     );
            // }
        }

        return (
            <div>
                <h1>FABRIK Algorithm - Unconstrained {this.fabrik.state.bones.length} Bones</h1>
                <Stage width={this.stage.width} height={this.stage.height}>
                    {/* This is just to draw a border around our drawing canvas Stage */}
                    <Layer>
                        <Rect width={this.stage.width} height={this.stage.height}
                              stroke="black" strokeWidth={3} dash={[10, 5]} />
                    </Layer>

                    {/* Actual drawn elements */}
                    <Layer x={this.layer.x} y={this.layer.y}>

                        <Base width={arm_settings.base.width} height={arm_settings.base.height}/>

                        <Group offsetX={-arm_settings.base.width / 2}>
                            {renderGrids}

                            {renderBones}

                            {renderPoints}


                            {/*Our End Target*/}
                            <Circle width={30} fill="rgba(255,0,0,0.5)"
                                    ref="target" draggable={true}
                                    x={this.state.target.x} y={this.state.target.y}
                                    onDragEnd={this.handleDragMove}
                                    onMouseOver={() => {document.body.style.cursor = "move"}}
                                    onMouseOut={() => {document.body.style.cursor = "default"}}
                            />

                        </Group>

                    </Layer>
                </Stage>

                <div id="controls">
                    <div>
                        <h3>Bone 1 Degree Values</h3>
                        <Slider min={-360} max={360} step={0.00001} value={this.state.bone1.angle} />
                        <InputNumber min={-360} max={360} step={0.00001} value={this.state.bone1.angle} />
                    </div>
                    <div>
                        <h3>Bone 2 Degree Values</h3>
                        <Slider min={-360} max={360} step={0.00001} value={this.state.bone2.angle} />
                        <InputNumber min={-360} max={360} step={0.00001} value={this.state.bone2.angle} />
                    </div>
                    <div>
                        <h3>Bone 3 Degree Values</h3>
                        <Slider min={-360} max={360} step={0.00001} value={this.state.bone3.angle} />
                        <InputNumber min={-360} max={360} step={0.00001} value={this.state.bone3.angle}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;