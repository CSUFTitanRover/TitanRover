import React, { Component } from 'react';
import Chart1 from './modules/Chart1';
import Chart2 from './modules/Chart2';
import Chart3 from './modules/Chart3';
import Module2 from './modules/Module2';
import LiveFeeds from './modules/livefeeds/LiveFeeds';
import FrontCamera from './modules/livefeeds/FrontCamera';
import RearCamera from './modules/livefeeds/RearCamera';

class Overview extends Component {
    render() {
        return (
            <div>
                <Chart1/>
                <Module2/>
                <Chart2/>
                <Chart3/>
                <LiveFeeds/>
            </div>
        );
    }
}

// exporting all dependent modules and itself
export default { Overview, Chart1, Chart2, Chart3, Module2, LiveFeeds, FrontCamera, RearCamera};