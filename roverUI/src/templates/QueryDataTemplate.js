import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';
import SensorOption from './SensorOptionTemplate';

/*
 Object {id: "01", timestamp: 1479856462231, EC: 1.03, VWC: 0, TempSoil: 22.9}

 Object {id: "02", timestamp: 1479856462281, Humidity: 34, TempOutside: 23}
 */

class QueryDataTemplate extends Component {

    constructor(props) {
        super(props);
        // this.chartID = this.props.sensorName + '-' + this.props.sensorID + '-Index-' + this.props.keyIndex; // creating CSS div id for later use
        this.state = {
            columns: [],
            queryAllData: false
        }
    }

    componentDidMount() {

        // initial render of the chart
        this._renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        // this.socketClient.on('get: client id', function () {
        //     console.log("get: client id, CALLED");
        //     self.socketClient.emit('set: client id', self.sensorID);
        // });
        //
        // // updating chart
        // this.socketClient.on('update: chart data', function(jsonObj) {
        //     console.info(jsonObj);
        //
        //     let tempColumns = self.state.columns;
        //
        //     // loop over each col in columns
        //     for(let col of tempColumns) {
        //
        //         let data_name = col[0]; // e.g. Humidity or TempSoil
        //
        //         // only allow 6 entries to be visible on the chart
        //         // remove first entry and append new entry
        //         if(col.length >= 16) {
        //             col.splice(1, 1); // remove entry in index: 1 (first data entry)
        //             col.push(jsonObj[data_name]);
        //
        //         }
        //         // append new entry
        //         else {
        //             col.push(jsonObj[data_name]);
        //         }
        //     }
        //
        //     // update columns state
        //     self.setState({columns: tempColumns});
        // });

    }
    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            columns: this.state.columns
        });
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartID.toString(),
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

    queryData() {
        this.socketClient = io.connect(rover_settings.homebase_ip);

        if (this.state.queryAllData) {
            this.socketClient.emit('get: queryAllData')
        }
        else {
            this.socketClient.emit('get: queryByTimerange')
        }

        this.socketClient.disconnect();
    }


    render() {

        return (
            <div>
                <div className="controls">
                    <SensorOption sensorName={this.props.sensorName} sensorID={this.props.sensorID} chartID={this.props.chartID} />
                    <button>{this.props.chartID}</button>
                </div>
                <div id={this.props.chartID}/>
            </div>
        );
    }
}

export default QueryDataTemplate;

/*
 TODO:
 - 8 modules needed for the page!
 - Maybe have behavior so that the server doesn't send data to the specific chart if the chart is paused
 - only sends it on the initial load OR when the chart requests to get data (started chart)
 */


