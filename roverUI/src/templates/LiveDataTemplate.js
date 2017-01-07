import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';

/*
 Object {id: "01", timestamp: 1479856462231, EC: 1.03, VWC: 0, TempSoil: 22.9}

 Object {id: "02", timestamp: 1479856462281, Humidity: 34, TempOutside: 23}
 */

class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect(rover_settings.homebase_ip); // set client to connect to the port where the homebase server listens on
        this.sensorID = this.getSensorID(this.props.sensorName);
        this.state = {
            columns: this.props.chartInitialColumns,
            isRunning: true
        };

        this.handleStartAndPause = this.handleStartAndPause.bind(this);
    }

    getSensorID(sensorName) {
        for (let sensor of rover_settings.sensorsList) {
            if (sensor.sensorName === sensorName)
                return sensor.sensorID;
        }
    }

    componentDidMount() {

        // initial render of the chart
        this._renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            console.log("get: client id, CALLED");
            self.socketClient.emit('set: client id', self.sensorID);
        });

        // updating chart
        this.socketClient.on('update: chart data', function(jsonObj) {
            //console.info(jsonObj);

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
            this.socketClient.connect(rover_settings.homebase_ip);
        }
    }

    render() {
        let isRunningState = (this.state.isRunning) ? 'Pause Chart' : 'Start Chart';

        return (
            <div>
                <div className="controls">
                    <button onClick={this.handleStartAndPause}>{isRunningState}</button>
                </div>
                <div id={this.sensorID}/>
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


