import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

const initialCols = [
    ['data1'],
    ['data2']
];

class Chart2 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="DHT 11 Chart">
                <LiveDataTemplate
                    chartID="DHT-11-Chart"
                    chartInitialColumns={initialCols}
                    chartType="area-spline"

                    clientID="02"
                />
            </BaseModuleTemplate>
        );
    }
}

export default Chart2;