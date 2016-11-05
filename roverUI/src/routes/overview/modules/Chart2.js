import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

const columns = [
    ['data1', 300, 350, 300, 0, 0, 0],
    ['data2', 130, 100, 140, 200, 150, 50]
];

const chartProps = {
    data: {
        columns: columns,
        types: {
            data1: 'area',
            data2: 'area-spline'
        }
    },
    zoom: {
        enabled: true
    }
};


class Chart2 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="Chart #2">
                <LiveDataTemplate
                    chartId="chart2"
                    chartInitialColumns={columns}
                    chartProps={chartProps}
                />
            </BaseModuleTemplate>
        );
    }
}

export default Chart2;