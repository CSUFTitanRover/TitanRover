import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';


class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect('localhost:8000'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            isRunning: true
        };

        this.handleStartAndPause = this.handleStartAndPause.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        this._renderChart();

        // socket Event handlers
        let self = this; // preserve "this"
        let tempColumns = this.state.columns;

        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            console.log("get: client id, CALLED");
            self.socketClient.emit('set: client id', self.props.clientID);
        });

        // updating chart
        this.socketClient.on('update: chart data', function(data) {
            // index of data[]
            let i = 0;

            // loop over each col in columns
            for(let col of tempColumns) {
                // only allow 6 entries to be visible on the chart
                // remove first entry and append new entry
                if(col.length >= 16) {
                    col.splice(1, 1); // remove entry in index: 1 (first data entry)
                    col.push(data[i]);
                    i++;
                }
                // append new entry
                else {
                    col.push(data[i]);
                    i++;
                }
            }

            // update columns state
            self.setState({columns: tempColumns});

        });

    }
    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            columns: this.state.columns
        });
    }

    componentWillUnmount() {
        this.socketClient.disconnect(); // do we need to disconnect our current connection when we unmount our charts from the viewpage?
                                        // does this have any performance benefits?
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartID,
            data: {
                columns: this.state.columns, // defaults to 'line' if no chartType is supplied by nature of c3.js behavior
                type: this.props.chartType
            },
            zoom: {
                enabled: true
            },
            ...this.props.chartProps // additional chart properties
        });
    }

    handleStartAndPause() {

        if (this.state.isRunning) {
            // handle pause
            this.setState({isRunning: false});
            this.socketClient.disconnect();
        }
        else {
            // handle start
            this.setState({isRunning: true});
            this.socketClient.connect('localhost:8000');
        }
    }

    render() {
        let isRunningState = (this.state.isRunning) ? 'Pause Chart' : 'Start Chart';

        return (
            <div>
                <div className="controls">
                    <button onClick={this.handleStartAndPause}>{isRunningState}</button>
                </div>
                <div id={this.props.chartId} />
            </div>
        );
    }
}

export default LiveDataTemplate;

/*
TODO:
- 8 modules needed for the page!
- Maybe have behavior so that the server doesn't send data to the specific chart if the chart is paused
    - only sends it on the initial load OR when the chart requests to get data (started chart)
 */


