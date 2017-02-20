import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';
import { Button } from 'antd';

/*
 Object {id: "01", timestamp: 1479856462231, EC: 1.03, VWC: 0, TempSoil: 22.9}

 Object {id: "02", timestamp: 1479856462281, Humidity: 34, TempOutside: 23}
 */

class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect(rover_settings.homebase_ip); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            isRunning: true
        };
        this.chartID = this.props.sensorName + '-' + this.props.sensorID; // creating CSS div id for later use
        this.handleStartAndPause = this.handleStartAndPause.bind(this);
    }

    componentDidMount() {
        // use maxWidth to hardcode chart width for performance
        // Note: This option should be specified if possible because it can improve its performance because
        // some size calculations will be skipped by an explicit value.
        this.maxWidth = document.querySelector('#main-content').clientWidth - 50;

        // initial render of the chart
        this._renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            console.info("get: client id CALLED. Sending...");
            console.info(self.chartID);
            self.socketClient.emit('set: client id', self.props.sensorID);
        });

        // updating chart
        this.socketClient.on('update: chart data', function(jsonObj) {
            console.info('update: chart data CALLED');
            console.info(jsonObj);

            let tempColumns = self.state.columns;

            // loop over each col in columns
            for(let col of tempColumns) {

                let data_name = col[0]; // e.g. Humidity or TempSoil

                // only allow 6 entries to be visible on the chart
                // remove first entry and append new entry
                if(col.length >= 16) {
                    col.splice(1, 1); // remove entry in index: 1 (first data entry)
                    col.push(jsonObj[data_name]);

                }
                // append new entry
                else {
                    col.push(jsonObj[data_name]);
                }
            }

            // update columns state
            self.setState({columns: tempColumns});
        });

    }
    componentDidUpdate() {
        // load new data into our chart
        // this.chart.load({
        //     columns: this.state.columns
        // });

        // this.chart.flow({
        //     columns: this.state.columns,
        //     length: 1,
        // });
    }

    componentWillUnmount() {
        this.socketClient.disconnect(); // do we need to disconnect our current connection when we unmount our charts from the viewpage?
                                        // does this have any performance benefits?
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.chartID.toString(),
            data: {
                columns: this.state.columns,
                type: this.props.chartType  // defaults to 'line' if no chartType is supplied by nature of c3.js behavior
            },
            size: {
                width: this.maxWidth
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
            this.socketClient.connect(rover_settings.homebase_ip);
        }
    }

    render() {
        let isRunningState = (this.state.isRunning) ? 'Pause Chart' : 'Start Chart';

        return (
            <div>
                <div className="controls">
                    <Button type="primary" onClick={this.handleStartAndPause}>{isRunningState}</Button>
                </div>
                <div id={this.chartID}/>
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


