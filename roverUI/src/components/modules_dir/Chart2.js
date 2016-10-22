import React, { Component } from 'react';
import ModuleTemplate from './ModuleTemplate';
import c3 from 'c3';

const columns = [
    ['data1', 300, 350, 300, 0, 0, 0],
    ['data2', 130, 100, 140, 200, 150, 50]
];

class Chart2 extends Component {

    componentDidMount() {
        this._renderChart();
    }
    componentDidUpdate() {
        this._renderChart();
    }
    componentWillReceiveProps(newProps) {
        this.chart.load({
            json: newProps.data
        }); // or whatever API you need
    }
    _renderChart() {
        this.chart = c3.generate({
            bindto: '#chart2',
            data: {
                columns: columns,
                types: {
                    data1: 'area',
                    data2: 'area-spline'
                }
            }
        });
    }

    render() {
        return (
            <ModuleTemplate moduleName="Chart #2">
                <div id="chart2"></div>
            </ModuleTemplate>
        );
    }
}

export default Chart2;