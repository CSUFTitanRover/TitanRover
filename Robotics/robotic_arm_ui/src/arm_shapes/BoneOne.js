import React, { Component } from 'react';
import { Rect, Circle, Group, Text } from 'react-konva';
import BoneTwo from './BoneTwo';
import arm_settings from '../arm_settings.json';

class BoneOne extends Component {
    constructor(props) {
        super(props);

        this.state = {
            angle: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        // animate the rotation on angle change for only boneOne
        if (nextProps.armState.boneOne.angle !== this.state.angle) {
            this.refs.boneOne.to({
                rotation: nextProps.armState.boneOne.angle,
                duration: 0.3
            });

            this.setState({angle: nextProps.armState.boneOne.angle});
        }
    }

    render() {
        return (
            <Group x={arm_settings.base.width / 2} ref="boneOne"
                   offsetX={15} offsetY={arm_settings.boneOne.height / 2}
            >
                <Circle width={10} height={10} fill="black" x={15} y={arm_settings.boneOne.height / 2}/>
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
                {/* Bounds Bone One Circle */}
                <Circle width={arm_settings.boneOne.width } height={arm_settings.boneOne.width }
                        stroke="rgba(0, 255, 4, 0.5)" dash={[10, 15]}
                        x={arm_settings.boneOne.width / 2} y={arm_settings.boneOne.height / 2}
                />

                <BoneTwo armState={this.props.armState}/>
            </Group>
        );
    }
}

export default BoneOne;
