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
        this.pi = Math.PI; // cache for use later on
        fabrik.addBone(arm_settings.bone1.length);
        fabrik.addBone(arm_settings.bone2.length);
        fabrik.addBone(arm_settings.bone3.length);

        // For Demo purposes
        // let numberOfBones = 20;
        // for(let i = 0; i < numberOfBones; i++) {
        //     fabrik.addBone(20);
        // }

        let initialPoints = {}, initialBones = {}, angle;
        for(let i = 0, length = fabrik.points.length; i < length; i++) {
            // dynamically set all the States' points with the New Points
            angle =  Math.atan2(fabrik.points[i].y, fabrik.points[i].x);
            angle = angle * (180 / this.pi);

            initialPoints["p" + i] = {
                x: fabrik.points[i].getComponent(0),
                y: fabrik.points[i].getComponent(1) * -1, // this is to convert from cartesianal to gui coordiantes
            };

            initialBones["bone" + i] = {
                angle: angle
            }
        }

        // init default values
        this.state = Object.assign({},
            initialPoints,
            initialBones,
            {
                target: {
                    x: fabrik.points[fabrik.points.length - 1].x,
                    y:fabrik.points[fabrik.points.length - 1].y * -1
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

        // solvedPoints will be an array of type Victor Objects
        let solvedPoints = this.fabrik.solveIK(target.x, target.y);

        const newState = this.state;
        let angle, dx, dy;
        for(let i = 1, length = solvedPoints.length; i < length; i++) {
            // updating the respective bone's angle
            // dx = solvedPoints[i].getComponent(0) - newState["p" + i].x;
            // dy = solvedPoints[i].getComponent(1) - newState["p" + i].y;
            angle =  Math.atan2(solvedPoints[i].getComponent(1), solvedPoints[i].getComponent(0));
            angle = angle * (180 / this.pi);
            newState["bone" + i].angle = angle;

            // dynamically updating all the States' points with the New Points
            newState["p" + i].x = solvedPoints[i].getComponent(0);
            newState["p" + i].y = solvedPoints[i].getComponent(1) * -1; // this is to convert from cartesianal to gui coordiantes
        }

        // just to update the circle targets new (x, y). Don't worry about this.
        newState.target.x = target.x;
        newState.target.y = target.y * -1;

        this.setState(newState);
    };

    componentWillMount() {
        // Save randomly generated colors for the renderPoints
        this.randomColors = [];

        for(let i=0, length=this.fabrik.points.length; i < length; i++) {
            this.randomColors.push(Konva.Util.getRandomColor());
        }
    }

    /**
     * @param angle {Number} - Angle to use
     * @param vector3 {Vector3} - Vector of the point to modify
     */
    updateBonePosition = (angle, vector3) => {
        return;
    };

    handleBone2AngleChange = (angleValue) => {

        let newPosition = {x: null, y: null};
        const prevPoint = this.fabrik.points[1];
        const fabrikP2 = this.fabrik.points[2];
        const state = this.state;
        newPosition.x = (arm_settings.bone2.length) * Math.cos(angleValue * (this.pi/180)) + prevPoint.getComponent(0);
        newPosition.y = (arm_settings.bone2.length) * Math.sin(angleValue * (this.pi/180)) + prevPoint.getComponent(1);
        newPosition.y *= -1; // converting back to cartesianal plane

        // update the position & angle for React's state
        state.p2.x = newPosition.x;
        state.p2.y = newPosition.y;
        state.bone2.angle = angleValue;
        this.setState(state);

        // update the position & angle in Fabrik
        fabrikP2.setComponent(0, newPosition.x);
        fabrikP2.setComponent(1, newPosition.y);
    };

    render() {
        let renderPoints = [], renderLines = [], controls = [], renderGrids = [];
        for(let i=0, length=this.fabrik.points.length; i < length; i++) {
            renderPoints.push(
                <Circle x={this.state["p" + i].x} y={this.state["p" + i].y}
                        width={15} fill={this.randomColors[i]} key={i}
                />
            );

            // make sure we don't go out of bounds
            if (i <= length - 2) {
                renderLines.push(
                    <Line stroke="rgb(170,170,170)" strokeWidth={5} key={i}
                          points={[
                              this.state["p" + i].x, this.state["p" + i].y,
                              this.state["p" + (i + 1)].x, this.state["p" + (i + 1)].y
                          ]}
                    />
                );
            }

            // y-grids
            renderGrids.push(
              <Rect x={this.state["p" + i].x} y={-this.stage.height + arm_settings.base.height}
                    width={2} height={this.stage.height}
                    fill={this.randomColors[i]}
              />
            );

            //x-grids
            renderGrids.push(
                <Rect x={-this.stage.width/2} y={this.state["p" + i].y}
                      width={this.stage.width} height={2}
                      fill={this.randomColors[i]}
                />
            );

            // For demo purposes
            // ignore the first point (base point) since its just (0,0)
            // if (i !== 0) {
            //     controls.push(
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
                <h1>FABRIK Algorithm - Unconstrained {this.fabrik.lengths.length} Bones</h1>
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

                            {renderLines}

                            {renderPoints}


                            {/*Our End Target*/}
                            <Circle width={30} fill="rgba(255,0,0,0.5)"
                                    ref="target" draggable={true}
                                    x={this.state.target.x} y={this.state.target.y}
                                    onDragMove={this.handleDragMove}
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
                        <Slider min={-360} max={360} step={0.00001} value={this.state.bone2.angle} onChange={this.handleBone2AngleChange}/>
                        <InputNumber min={-360} max={360} step={0.00001} value={this.state.bone2.angle} onChange={this.handleBone2AngleChange}/>
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