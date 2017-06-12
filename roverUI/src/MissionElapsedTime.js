import React, { Component } from 'react';
import { Button, Row, Col, Tag } from 'antd';
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
            <Row id="met" type="flex">
                <Col xs={1} sm={7} md={6} lg={5} xl={3}>
                    <h3>Mission Elapsed Time</h3>
                </Col>
                <Col xs={13} sm={8} md={7} lg={6} xl={4}>
                    <Tag className="time-box" color="green">
                        <span className="utc value">UTC</span>
                        <span className="date value">{this.date}</span>
                        <span className="formatted-time value" style={this.state.isRunning ? {color: 'black'} : null}>
                            {formatted_time}
                        </span>
                    </Tag>
                </Col>
                <Col xs={8} sm={5} md={4} lg={4} xl={3}>
                    <Button type="primary" onClick={this.handleStartAndPause}>{isRunningState}</Button>
                </Col>
                <Col xs={2} sm={4} md={4} lg={4} xl={3}>
                    <Button type="danger" onClick={this.handleReset} disabled={resetDisabledState}>Reset</Button>
                </Col>
            </Row>
        )
    }

}

export default MissionElapsedTime;