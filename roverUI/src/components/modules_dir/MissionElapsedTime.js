import React, { Component } from 'react';

class MissionElapsedTime extends Component {
    render() {

        return (
            <div id="met" className="module">
                <h4>Mission Elapsed Time</h4>
                <span className="utc">UTC</span>
                <span className="date">2016/21/10</span>
                <span className="time">00:03:27</span>
            </div>
        )
    }

}

export default MissionElapsedTime;