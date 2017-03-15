import React, { Component } from 'react';
import { Rect, Circle, Group, Text } from 'react-konva';
import arm_settings from '../arm_settings.json';

class BoneTwo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            angle: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        // animate the rotation on angle change for only boneTwo
        if (nextProps.armState.boneTwo.angle !== this.state.angle) {
            this.refs.boneTwo.to({
                rotation: nextProps.armState.boneTwo.angle,
                duration: 0.3
            });

            this.setState({angle: nextProps.armState.boneTwo.angle});
        }
    }

    render() {
        return (
            <Group ref="boneTwo" x={arm_settings.boneOne.width - 15} y={arm_settings.boneTwo.height / 2}
                   offsetX={15} offsetY={arm_settings.boneTwo.height / 2}
            >
                <Circle width={10} height={10} fill="black" x={15} y={arm_settings.boneTwo.height / 2}/>
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

                {/* Bounds Bone Two Circle */}
                <Circle width={arm_settings.boneTwo.width } height={arm_settings.boneTwo.width } stroke="rgba(0, 187, 255, 0.5)" dash={[10, 15]}
                        x={arm_settings.boneTwo.width / 2} y={arm_settings.boneTwo.height / 2}
                />

            </Group>
        );
    }
}

export default BoneTwo;
