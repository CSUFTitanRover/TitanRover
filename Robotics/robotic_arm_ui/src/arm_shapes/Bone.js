import React, { Component } from 'react';
import { Rect, Circle, Group } from 'react-konva';

class Bone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mouseFocus: false,
            mouseMove: false,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.rotation !== this.state.rotation) {
            this.setState({rotation: nextProps.rotation});
        }
    }

    componentDidMount() {
        // setInterval( () => {
        //     this.setState({rotation: this.state.rotation+1});
        //     console.info(this.state.rotation);
        // }, 10);
    }

    // we need to write our own "drag" function because the native one is wonky

    // handleMouseDownAndUp = (e) => {
    //     console.info("mouse down/up");
    //     this.setState( (prevState) => {
    //         return {mouseFocus: !prevState.mouseDown}
    //     });
    // };

    handleMouseDown = () => {
        this.setState({mouseFocus: true});
    };

    handleMouseUp = () => {
        this.setState({mouseFocus: false});
    };

    handleMouseLeave = () => {
        this.setState({mouseFocus: false});
    };

    handleMouseMove = (e) => {
        if (this.state.mouseFocus) {
            console.info("mouse move");
            console.info(e);
            console.info(e.evt.x, e.evt.y);

            let mouseX = e.evt.x,
                mouseY = e.evt.y;

            let x = e.target.attrs.offsetX - mouseX,
                y = e.target.attrs.offsetY - mouseY;

            let rotation = (0.5 * Math.PI + Math.atan(y/x));

            this.props.parentSetState({
                [this.props.name]: {
                    rotation: rotation
                }
            });
            // // here we calculate rotation degrees
            // let x = e.evt.x, y = e.evt.y;
            //
            // let calc = Math.atan2(y, x);
            // console.info('calc: ' + calc);
            //
            // console.info('rotation: ' + this.state.rotation);
            // let rotation;
            // // bounding to 90 degrees of rotation in the First Quadrant
            // if (this.state.rotation <= 360 && this.state.rotation >= 270)
            //     rotation = this.state.rotation - calc;
            // else if (this.state.rotation < 270) {
            //     rotation = this.state.rotation + calc;
            // }



            this.setState({mouseMove: true});
        }
        else {
            this.setState({mouseMove: false});
        }
    };

    // Notes:
    // offset() sets the point of which the shape rotates about inside that shape
    //
    // Each Joint needs to handle its child joint's x and y position about the end when rotating

    render() {

        // we set our drawing reference point to the bottom center of the Stage
        return (
            <Group x={this.props.groupX} y={this.props.groupY}>
                <Circle width={10} height={10} fill="red" x={0} y={0}/>
                <Rect
                    ref="rect"
                    x={this.props.x || 0} y={this.props.y || 0}
                    offsetX={this.props.width} offsetY={this.props.height / 2}
                    width={this.props.width} height={this.props.height}
                    fill={this.props.fill}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    rotation={this.props.rotation}
                />
            </Group>
        );
    }
}

export default Bone;
