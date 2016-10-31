import React, { Component } from 'react';
import ModuleTemplate from './ModuleTemplate';

class MissionElapsedTime extends Component {
    constructor(props) {
        super(props);

        this.elapsedTime = 0;
        let d = new Date(); // temp date obj
        this.date = d.getFullYear()+'/'+d.getDate()+'/'+(d.getMonth()+1); // date for current day
        this.interval = null;
        this.tick = this.tick.bind(this);
        this.handleStartAndStop = this.handleStartAndStop.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.state = {
            isRunning: false,
            resetDisabled: false,
            elapsedTotalTime: 0
        };
    }

    tick() {
        this.elapsedTime += 1;
        this.setState({elapsedTotalTime: this.elapsedTime});
    }

    handleStartAndStop() {
        // check if the stopwatch is running already stop it
        if (this.state.isRunning) {
            this.handleStop();
        }
        else {
            // starting stopwatch
            this.setState({isRunning: true, resetDisabled: true});

            //set the interval for every second
            this.interval = setInterval(this.tick.bind(this), 1000);
        }
    }

    handleStop() {
        this.setState({isRunning: false, resetDisabled: false});
        clearInterval(this.interval);
    }

    handleReset() {
        this.elapsedTime = 0;
        this.setState({elapsedTotalTime: 0});
    }

    formatTime(passed_time) {
        var sec_num = passed_time;
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
    /*
        If the page is accidentally refreshed then the timer is reset
        check when the component is going to be unmounted if the timer isRunning === true
        If TRUE, then save the current elapsedTotalTime to storage and load it back in
        once the page is done refreshing then delete that stored data.
        Maybe use localStorage???
     */
    componentWillUnmount() {
        clearInterval(this.interval);
        if (this.state.isRunning) {
            return;
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
