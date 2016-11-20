import React, { Component } from 'react';
import Chart1 from './modules/Chart1';
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
                <LiveFeeds/>
            </div>
        );
    }
}

// exporting all dependent modules and itself
export default { Overview, Chart1, Module2, LiveFeeds, FrontCamera, RearCamera};