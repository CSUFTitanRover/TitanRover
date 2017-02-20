import React, { Component } from 'react';
import Decagon5TE from './modules/Decagon-5TE';
import DHT11 from './modules/DHT-11';
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
                <Decagon5TE/>
                <DHT11/>
                <LiveFeeds/>
            </div>
        );
    }
}

// exporting all dependent modules and itself
export default {
    Overview,
    Decagon5TE,
    DHT11,
    LiveFeeds,
    ArmCamera,
    MastCamera,
    LeftCamera,
    RightCamera,
    Surround
};
