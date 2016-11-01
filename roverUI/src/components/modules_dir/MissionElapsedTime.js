import React, { Component } from 'react';
import ModuleTemplate from './ModuleTemplate';

class MissionElapsedTime extends Component {
    constructor(props) {
        super(props);

        let savedElapsedTime = parseInt(localStorage.getItem('savedElapsedTime'), 10);
        let savedIsRunning = (localStorage.getItem('savedIsRunning') == "true");  // convert savedIsRunning (str) to a bool type

        // load in savedElapsedTime for persistence or default to 0
        this.elapsedTime = savedElapsedTime || 0;
        let d = new Date(); // temp date obj
        this.date = d.getFullYear()+'/'+d.getDate()+'/'+(d.getMonth()+1); // date for current day
        this.interval = null;
        this.tick = this.tick.bind(this);
        this.handleStartAndStop = this.handleStartAndStop.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.state = {
            // load in savedIsRunning or default to false
            isRunning: ( savedIsRunning || false),
            resetDisabled: false,
            // load in savedElapsedTime for persistence or default to 0
            elapsedTotalTime: ( savedElapsedTime || 0)
        };
    }

    tick() {
        this.elapsedTime += 1;
        this.setState({elapsedTotalTime: this.elapsedTime});
        localStorage.setItem('savedElapsedTime', this.elapsedTime);
    }

    handleStartAndStop() {
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
        this.elapsedTime = 0;
        this.setState({elapsedTotalTime: 0});
        localStorage.removeItem('savedElapsedTime');
    }

    formatTime(passed_time) {
        let sec_num = passed_time;
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0" + hours;}
        if (minutes < 10) {minutes = "0" + minutes;}
        if (seconds < 10) {seconds = "0" + seconds;}

        return hours+':'+minutes+':'+seconds;
    }

    componentDidMount() {
        // check if isRunning is true via loaded from localStorage.savedIsRunning
        if (this.state.isRunning == true) {
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
            <ModuleTemplate id="met" moduleName="Mission Elapsed Time">
                <span className="utc">UTC</span>
                <span className="date">{this.date}</span>
                <time>
                    {formatted_time}
                </time>
                <div className="controls">
                    <button onClick={this.handleStartAndStop}>{isRunningState}</button>
                    <button onClick={this.handleReset} disabled={resetDisabledState}>Reset</button>
                </div>

            </ModuleTemplate>
        )
    }

}

export default MissionElapsedTime;
