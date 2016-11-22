import React, { Component } from 'react';
import Chart1 from './modules/Decagon 5TE Chart';
import Chart2 from './modules/DHT 11 Chart';
import LiveFeeds from './modules/livefeeds/LiveFeeds';
import FrontCamera from './modules/livefeeds/FrontCamera';
import RearCamera from './modules/livefeeds/RearCamera';

class Overview extends Component {
    render() {
        return (
            <div>
                <Chart1/>
                <Chart2/>
                <LiveFeeds/>
            </div>
        );
    }
}

// exporting all dependent modules and itself
export default { Overview, Chart1, Chart2, LiveFeeds, FrontCamera, RearCamera};