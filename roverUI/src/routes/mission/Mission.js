import React, { Component } from 'react';
import Decagon5TE from './modules/Decagon-5TE';
import DHT11 from './modules/DHT-11';
import C02 from './modules/C02';
import Waypoints from './modules/waypoints/Waypoints';
import LiveFeeds from './modules/livefeeds/LiveFeeds';
import ArmCamera from './modules/livefeeds/ArmCamera';
import FrontCamera from './modules/livefeeds/FrontCamera';
import Surround from './modules/livefeeds/Surround';

class Overview extends Component {
    render() {
        return (
            <div>
                <Decagon5TE/>
                <C02/>
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
    C02,
    Waypoints,
    LiveFeeds,
    ArmCamera,
    FrontCamera,
    Surround
};
