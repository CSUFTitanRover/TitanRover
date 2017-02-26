import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';

class SonicRangeFinder extends Component {
    constructor(props) {
        super(props);

        this.state = {
          rangeValue: null
        };
    }

    componentDidMount() {
        // setInterval( () => {
        //     this.setState({rangeValue: Math.round(Math.random() * 100) });
        // }, 500);
    }

    render() {
        return (
            <BaseModuleTemplate moduleName="Sonic-Range-Finder Chart">
                <p>Range Values will go here</p>
                <div className="sonic-range-value">{this.state.rangeValue}</div>
            </BaseModuleTemplate>
        );
    }
}

export default SonicRangeFinder;
