import React, { Component } from 'react';
import c3 from 'c3';
import socket from 'socket.io';

class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: []
        };
    }

    componentDidMount() {
        socket.on('init', this._initialize);
        socket.on('send:message', this._messageRecieve);
        socket.on('user:join', this._userJoined);
        socket.on('user:left', this._userLeft);
        socket.on('change:name', this._userChangedName);

        this._renderChart();

    }
    componentDidUpdate() {
        this._renderChart();
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartId,
            ...this.props.chartProps // additional chart properties
        });
    }

    render() {
        return (
            <div id={this.props.chartId}></div>
        );
    }
}

export default LiveDataTemplate;

/*
TODO:
- write the client side for socket io to see what requests are sent to React
- figure out the server side socket io for how that data is going to be sent to Client side
- what data is going to be udpated? Just chart.columns?
 */