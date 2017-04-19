import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import { Progress } from 'antd';

class SonicRangeFinder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rangeValue: null,
            percent: 0
        };
    }

    componentDidMount() {
        let intervalID = setInterval( () => {
            // this.setState({rangeValue: Math.round(Math.random() * 100) });
            if (this.state.percent >= 100) {
                clearInterval(intervalID);
            }
            this.setState({percent: this.state.percent+1})
        }, 50);
    }

    render() {
        return (
            <BaseModuleTemplate moduleName="Sonic-Range-Finder Chart">
                <p>Range Values will go here</p>
                <div className="sonic-range-value">{this.state.rangeValue}</div>

                <Progress type="circle" percent={this.state.percent}/>
            </BaseModuleTemplate>
        );
    }
}

export default SonicRangeFinder;
