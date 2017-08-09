import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';

class MissionElapsedTime extends Component {
    constructor(props) {
        super(props);

        // load in savedElapsedTime or default to 0
        let savedElapsedTime = parseInt(localStorage.getItem('savedElapsedTime'), 10) || 0;
        // load in savedIsRunning or default to false
        let savedIsRunning = (localStorage.getItem('savedIsRunning') === 'true') || false;  // convert savedIsRunning (str) to a bool type

        this.date = moment().format("MM/DD/YYYY"); // date for current day
        this.tick = this.tick.bind(this);
        this.handleStartAndPause = this.handleStartAndPause.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.state = {
            isRunning: savedIsRunning,
            resetDisabled: false,
            elapsedTotalTime: savedElapsedTime
        };
    }

    tick() {
        this.setState({elapsedTotalTime: this.state.elapsedTotalTime + 1});
        localStorage.setItem('savedElapsedTime', this.state.elapsedTotalTime);
    }

    handleStartAndPause() {
        // check if the stopwatch is running already stop it
        if (this.state.isRunning) {
            this.handleStop();
        }
        else {
            // starting stopwatch
            this.setState({isRunning: true, resetDisabled: true});
            localStorage.setItem('savedIsRunning', 'true');

            //set the interval for every second
            this.interval = setInterval(this.tick, 1000);
        }
    }

    handleStop() {
        this.setState({isRunning: false, resetDisabled: false});
        localStorage.setItem('savedIsRunning', 'false');
        clearInterval(this.interval);
    }

    handleReset() {
        this.setState({elapsedTotalTime: 0});
        localStorage.removeItem('savedElapsedTime');
    }

    formatTime(passed_time) {
        return moment().hour(0).minute(0).second(passed_time).format('HH:mm:ss');
    }

    componentDidMount() {
        // check if isRunning is true via loaded from localStorage.savedIsRunning
        if (this.state.isRunning === true) {
            // if so we auto-start the timer
            this.setState({resetDisabled: true});
            //set the interval for every second
            this.interval = setInterval(this.tick, 1000);
        }
    }

    render() {
        let formatted_time = this.formatTime(this.state.elapsedTotalTime);
        let isRunningState = (this.state.isRunning) ? 'Pause Stopwatch' : 'Start Stopwatch';
        let resetDisabledState = (this.state.resetDisabled) ? 'disabled' : null;

        return (
            <div id="met">
                <h3>Mission Elapsed Time</h3>
                <div className="time-box">
                    <span className="utc">UTC</span>
                    <span className="date">{this.date}</span>
                    <time>
                        {formatted_time}
                    </time>
                </div>
                <div className="controls">
                    <Button type="primary" onClick={this.handleStartAndPause}>{isRunningState}</Button>
                    <Button type="danger" onClick={this.handleReset} disabled={resetDisabledState}>Reset</Button>
                </div>
            </div>
        )
    }

}

export default MissionElapsedTime;