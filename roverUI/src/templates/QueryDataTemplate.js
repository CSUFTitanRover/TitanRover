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

        this.state = {
            columns: [],
            queryAllData: true,
            queryByTimeRange: false,
            queryStartTime: null,
            queryEndTime: null
        };

        this.queryData = this.queryData.bind(this);
        this.handleQueryByChange = this.handleQueryByChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeleteCurrentChart = this.handleDeleteCurrentChart.bind(this);
        this.handleSelectedChartType = this.handleSelectedChartType.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        this._renderChart();
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
                columns: this.state.columns,
                type: 'line'// defaults to 'line' if no chartType is supplied by nature of c3.js behavior
            },
            zoom: {
                enabled: true
            }
        });
    }

    queryData() {
        this.socketClient = io.connect(rover_settings.homebase_ip);

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            self.socketClient.emit('set: client id', self.props.chartID);
        });

        // events for Querying
        // receiving queried All Data from homebase
        this.socketClient.on('set: queryAllData', function(jsonObj) {
            console.info('Receieved data from homebase!');
            console.info(jsonObj);

            // first check if the query was unsuccessful
            if('errorMessage' in jsonObj) {
                console.info('There was an error querying all the data!')
            }
            else {
                // set state of the new columns
                self.setState(jsonObj)
            }
        });
        // receiving queried Time Range Data from homebase
        this.socketClient.on('set: queryByTimerange', function(jsonObj) {
            console.info('Receieved data from homebase!');
            console.info(jsonObj);

            // first check if the query was unsuccessful
            if('errorMessage' in jsonObj) {
                console.info('There was an error querying all the data!')
            }
            else {
                // set state of the new columns
                self.setState(jsonObj)
            }
        });


        let dataToBeQueried = {sensorID: this.props.sensorID};

        if (this.state.queryAllData) {
            this.socketClient.emit('get: queryAllData', dataToBeQueried)
        }
        else {
            // we need to add the start and end timerange
            // ...dataToBeQueried uses the spread operator in es2015
            dataToBeQueried = {...dataToBeQueried, queryStartTime: this.state.queryStartTime, queryEndTime: this.state.queryEndTime};
            this.socketClient.emit('get: queryByTimerange', dataToBeQueried)
        }

        console.info('Data to be queried:');
        console.info(JSON.stringify(dataToBeQueried, null, '\t'));

        this.socketClient.disconnect();

    }

    handleInputChange(name, inputValue) {
        this.setState({[name]: inputValue});
    }

    handleQueryByChange(stateObj) {
        this.setState(stateObj);
    }

    handleDeleteCurrentChart() {
        this.props.handleDeleteCurrentChart(this.props.sensorName, this.props.keyIndex);
    }

    handleSelectedChartType(chartType) {
        this.chart.transform(chartType);
    }

    render() {

        return (
            <div className="query-chart-panel">
                <div className="controls">
                    <SensorOption sensorName={this.props.sensorName} sensorID={this.props.sensorID} chartID={this.props.chartID}
                                  handleInputChange={this.handleInputChange} handleQueryByChange={this.handleQueryByChange}
                                  handleSelectedChartType={this.handleSelectedChartType}
                    />
                    <span className="options-border"/>
                    <button className="query-data-button" onClick={this.queryData}>Query Data</button>
                    <span className="options-border"/>
                    <div className="delete-chart-button tabtab__folder__circle" title="delete current chart" onClick={this.handleDeleteCurrentChart}></div>
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


