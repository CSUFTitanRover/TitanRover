import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

const initialCols = [
    ['Humidity'],
    ['TempOutside']
];

class Chart2 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="DHT 11 Chart">
                <LiveDataTemplate
                    sensorName="DHT-11"
                    chartInitialColumns={initialCols}
                    chartType="bar"
                />
            </BaseModuleTemplate>
        );
    }
}

export default Chart2;