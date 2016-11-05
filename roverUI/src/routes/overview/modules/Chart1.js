import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

const columns = [
    ['My Numbers', 30, 200, 100, 400, 150, 250],
    ['Your Numbers', 50, 20, 10, 40, 15, 25]
];

const chartProps = {
    data: {
        columns: columns,
        type: 'line',
    }
};

class Chart1 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="Chart #1">
                <LiveDataTemplate
                    chartId="chart1"
                    chartInitialColumns={columns}
                    chartProps={chartProps}
                />
            </BaseModuleTemplate>
        );
    }
}

export default Chart1;