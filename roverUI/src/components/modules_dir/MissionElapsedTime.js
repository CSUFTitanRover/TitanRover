import React, { Component } from 'react';

class MissionElapsedTime extends Component {
    componentDidMount(){
        var dateClass = document.getElementsByClassName("date");
        var d = new Date();
        dateClass[0].innerHTML= d.getFullYear()+'/'+d.getDate()+'/'+(d.getMonth()+1);
    }
    render() {

        return (
            <div id="met" className="module">
                <h4>Mission Elapsed Time</h4>
                <span className="utc">UTC</span>
                <span className="date"></span>
                <span className="time">00:03:27</span>
            </div>
        )
    }

}

export default MissionElapsedTime;