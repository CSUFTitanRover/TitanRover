import React, { Component } from 'react';
import {FastLayer, Layer, Rect, Stage, Group, Line, Circle, Wedge} from 'react-konva';
import Knob from 'react-canvas-knob';
import Banner from './titan-rover-banner.png';
import io from 'socket.io-client';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            degreeValue: 0,
            roverAngle: 0,
            knobDisabled: false
        };

        this.roverPoints = [
            0, 30,
            30, 0,
            60, 0,
            90, 30,
            90, 130,
            60, 160,
            30, 160,
            0,  130,
        ];

        // the port # needs to be the same in Server.js
        this.socketClient = io.connect('http://localhost:6993');
    }

    componentDidMount() {
        const self = this;
        this.socketClient.on('enable knob', function() {
            self.setState({knobDisabled: false});
            document.body.style.cursor = 'default';
        });
    }

    handleChange = (newValue) => {
        this.setState({degreeValue: newValue});
    };

    handleChangeEnd = (newValue) => {
        this.setState({roverAngle: newValue, knobDisabled: true});
        document.body.style.cursor = 'wait';

        // sending the new value over to the server where it will handle turning the physical rover
        this.socketClient.emit('new angle value', newValue);
    };

    render() {
        const stageWidth = 500, stageHeight = 500;
        const originX = stageWidth/2, originY = stageHeight/2;

        return (
            <div>
                <div id="header">
                    <img id="banner" height={75} src={Banner}/>
                    <h1>ECS Rover Demo</h1>
                </div>

                <div id="content">
                    <div id="rover-canvas">
                        <Stage width={stageWidth} height={stageHeight}>
                            <FastLayer>
                                <Rect width={stageWidth} height={stageHeight} fill="#f1f1f1"/>
                            </FastLayer>
                            <Layer x={originX} y={originY}>
                                <Group offsetX={45} offsetY={80} ref="rover" rotation={this.state.roverAngle}>
                                    {/*Wheels & Limbs*/}
                                    <Rect height={5} width={50} fill="gray"
                                          x={10} y={16} rotation={-135}
                                    />
                                    <Rect height={10} width={30} fill="gray"
                                          x={-15} y={-30} rotation={90}
                                    />

                                    <Rect height={5} width={50} fill="gray"
                                          x={81} y={16} rotation={-45}
                                    />
                                    <Rect height={10} width={30} fill="gray"
                                          x={120} y={-30} rotation={90}
                                    />

                                    {/*Line of Sight*/}
                                    <Wedge radius={90} angle={110} rotation={-145}
                                           fill="rgba(0, 255, 85, 0.4)" x={45}

                                    />
                                    {/* Chassis */}
                                    <Line points={this.roverPoints}
                                          closed={true}
                                          stroke="gray" strokeWidth={5}
                                    />


                                    {/*Wheels & Limbs*/}
                                    <Rect height={5} width={50} fill="gray"
                                          x={14} y={149} rotation={135}
                                    />
                                    <Rect height={10} width={30} fill="gray"
                                          x={-15} y={165} rotation={90}
                                    />

                                    <Rect height={5} width={50} fill="gray"
                                          x={77} y={148} rotation={45}
                                    />
                                    <Rect height={10} width={30} fill="gray"
                                          x={118} y={165} rotation={90}
                                    />
                                </Group>
                            </Layer>

                            <FastLayer>
                                <Circle fill="gray" x={originX} y={originY} width={5}/>
                            </FastLayer>
                        </Stage>
                    </div>
                    <div id="knob">
                        <h3>Change Angle Knob</h3>
                        <Knob
                            readOnly={this.state.knobDisabled}
                            value={this.state.degreeValue}
                            onChange={ this.handleChange }
                            onChangeEnd={ this.handleChangeEnd }
                            min={0}
                            max={360}
                            title="Angle Knob"
                            inputColor="#0af"
                            fgColor="#0af"
                        />
                        <h4 className={this.state.knobDisabled ? 'turning' : 'turning hidden'}>Turning...</h4>
                    </div>

                </div>
            </div>
        );
    }
}