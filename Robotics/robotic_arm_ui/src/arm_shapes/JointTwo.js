import React, { Component } from 'react';
import { Rect, Circle, Group } from 'react-konva';

class JointTwo extends Component {
    constructor(props) {
        super(props);
        this.width = 14.37 * 10; // multiplying by 10 to the same dimensions from the spec sheet
        this.height = 3.5 * 10; // guessing the height (thickness)

        this.state = {
            mouseFocus: false,
            mouseMove: false,
            rotation: 0 //starting position for arm
        };

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
            console.info(e.evt.x, e.evt.y);

            // here we calculate rotation degrees
            let x = e.evt.x, y = e.evt.y;

            let calc = Math.atan2(y, x);
            console.info('calc: ' + calc);

            console.info('rotation: ' + this.state.rotation);
            let rotation;
            // bounding to 90 degrees of rotation in the First Quadrant
            if (this.state.rotation <= 360 && this.state.rotation >= 270)
                rotation = this.state.rotation - calc;
            else if (this.state.rotation < 270) {
                rotation = this.state.rotation + calc;
            }

            this.setState({mouseMove: true, rotation});
        }
        else {
            this.setState({mouseMove: false});
        }
    };

    componentWillReceiveProps(props) {
        this.setState({rotation: props.rotation})
    }

    // Notes:
    // offset() sets the point of which the shape rotates about inside that shape

    render() {

        // we set our drawing reference point to the bottom center of the Stage
        return (
            <Group>
                <Circle width={10} height={10} fill="red" x={this.props.x} y={0}/>
                <Rect
                    ref="jointTwo"
                    x={this.props.x} y={0}
                    offsetX={0} offsetY={this.height / 2}
                    width={this.width} height={this.height}
                    fill="rgba(0, 153, 255, 0.5)"
                    rotation={this.state.rotation}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
                />
            </Group>
        );
    }
}

export default JointTwo;
