import React, { Component } from 'react';
import Chart1 from './Chart1';
import Module2 from './Module2';
import Chart2 from './Chart2';
import Chart3 from './Chart3';

class Overview extends Component {
    render() {
        return (
            <div>
                <Chart1/>
                <Module2/>
                <Chart2/>
                <Chart3/>
            </div>
        );
    }
}

export default Overview;