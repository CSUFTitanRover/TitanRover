import React, { Component } from 'react';
import ModuleTemplate from './ModuleTemplate';
import c3 from 'c3';

const columns = [
    ['My Numbers', 30, 200, 100, 400, 150, 250],
    ['Your Numbers', 50, 20, 10, 40, 15, 25]
];

class Chart1 extends Component {

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
            bindto: '#chart1',
            data: {
                columns: columns,
                type: 'line'
            }
        });
    }

    render() {
        return (
            <ModuleTemplate moduleName="Chart #1">

                <div id="chart1"></div>

                <p>
                    Let's be clear here, just in case someone is finding this from a search engine: there are no parent selectors in CSS, not even in CSS3. It is an interesting topic to talk about though, and some fresh talk has surfaced.
                </p>
            </ModuleTemplate>
        );
    }
}

export default Chart1;