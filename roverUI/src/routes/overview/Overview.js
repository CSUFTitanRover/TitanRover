import React, { Component } from 'react';
import Chart1 from './modules/Decagon 5TE Chart';
import Chart2 from './modules/DHT 11 Chart';
import LiveFeeds from './modules/livefeeds/LiveFeeds';
import ArmCamera from './modules/livefeeds/ArmCamera';
import MastCamera from './modules/livefeeds/MastCamera';
import LeftCamera from './modules/livefeeds/LeftCamera';
import RightCamera from './modules/livefeeds/RightCamera';
import Surround from './modules/livefeeds/Surround';

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
export default { Overview, Chart1, Chart2, LiveFeeds, ArmCamera, MastCamera, LeftCamera, RightCamera, Surround};
