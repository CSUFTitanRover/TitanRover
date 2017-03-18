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
        // fabrik.addBone(arm_settings.d0.length);
        // fabrik.addBone(arm_settings.d1.length);
        // fabrik.addBone(arm_settings.d2.length);

        let numberOfBones = 8;
        for(let i = 0; i < numberOfBones; i++) {
            fabrik.addBone(50);
        }

        let initialPoints = {}, angle;
        for(let i = 0, length = fabrik.points.length; i < length; i++) {
            // dynamically set all the States' points with the New Points
            angle =  Math.atan2(fabrik.points[i].y, fabrik.points[i].x);
            angle = angle * (180 / this.pi);
            initialPoints["p" + i] = {
                x: fabrik.points[i].x,
                y: fabrik.points[i].y * -1, // this is to convert from cartesianal to gui coordiantes
                angle: angle
            };
        }

        // init default values
        this.state = Object.assign({},
            initialPoints,
            {
                target: {
                    x: fabrik.points[fabrik.points.length - 1].x,
                    y:fabrik.points[fabrik.points.length - 1].y * -1
                }
            }
        );

        this.stage = {
            width: 1000,
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
        let angle;
        for(let i = 1, length = solvedPoints.length; i < length; i++) {
            // dynamically updating all the States' points with the New Points
            newState["p" + i].x = solvedPoints[i].x;
            newState["p" + i].y = solvedPoints[i].y * -1; // this is to convert from cartesianal to gui coordiantes

            angle =  Math.atan2(solvedPoints[i].y, solvedPoints[i].x);
            angle = angle * (180 / this.pi);
            newState["p" + i].angle = angle;
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

    render() {
        let renderPoints = [], renderLines = [], controls = [];
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

            // ignore the first point (base point) since its just (0,0)
            if (i !== 0) {
                controls.push(
                    <div key={i}>
                        <h3>Bone {i} Degree Values</h3>
                        <Slider min={0} max={360} step={0.01} value={this.state["p" + i].angle}/>
                        <InputNumber min={0} max={360} step={0.01} value={this.state["p" + i].angle}/>
                    </div>
                );
            }
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
                    {controls}
                </div>
            </div>
        );
    }
}

export default App;