import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';
import { Button, message } from 'antd';
import moment from 'moment';

class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect(rover_settings.homebase_ip); // set client to connect to the port where the homebase server listens on
        this.state = {
            isRunning: true,
            dataObj: null,
            dataKeys: null
        };
        this.dataPointsCounter = 0;

        this.chartID = this.props.sensorName + '-' + this.props.sensorID; // creating CSS div id for later use
        this.handleStartAndPause = this.handleStartAndPause.bind(this);
        this.handleBookmark = this.handleBookmark.bind(this);
    }

    componentDidMount() {
        // use maxWidth to hardcode chart width for performance
        // Note: This option should be specified if possible because it can improve its performance because
        // some size calculations will be skipped by an explicit value.
        this.maxWidth = document.querySelector('#main-content').clientWidth - 50;

        // initial render of the chart
        this.renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            console.info("get: client id CALLED. Sending...");
            console.info(self.chartID);
            self.socketClient.emit('set: client id', self.props.sensorID);
        });

        // updating chart
        this.socketClient.on('update: chart data', function(dataObj) {
            console.info('update: chart data CALLED');
            console.info(dataObj);

            let keys = [];

            for(let key in dataObj) {
                if (dataObj.hasOwnProperty(key)) {
                    // add all keys in except for ID
                    if (!(key === 'id')) {
                        keys.push(key);
                    }
                }
            }
            // convert to Date Object for c3 to use as labeling
            dataObj.timestamp = new Date(dataObj.timestamp);

            self.setState({dataObj: dataObj, dataKeys: keys});

            self.dataPointsCounter++;
        });

    }

    componentDidUpdate() {
        this.chart.flow({
            json: [this.state.dataObj],
            keys: {
                x: 'timestamp',
                value: this.state.dataKeys,
            },
            length: (this.dataPointsCounter > 15) ? 1 : 0
        });
    }

    componentWillUnmount() {
        this.socketClient.disconnect(); // do we need to disconnect our current connection when we unmount our charts from the viewpage?
                                        // does this have any performance benefits?
    }

    renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.chartID.toString(),
            data: {
                json: [],
                type: this.props.chartType,  // defaults to 'line' if no chartType is supplied by nature of c3.js behavior
            },
            size: {
                width: this.maxWidth
            },
            zoom: {
                enabled: true
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S' // Error displaying Hour. It's not the correct hour
                    }
                }
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

    handleBookmark() {
        let startTime, endTime, firstDataPoint, lastDataPoint;
        let chartData = this.chart.data.shown(); // returns array of nested objects

        chartData = chartData[0]; // we can just use the 1st element object to get the start/end timestamps
        firstDataPoint = chartData.values[0];
        lastDataPoint = chartData.values[(chartData.values.length-1)];
        startTime = firstDataPoint.x;
        endTime = lastDataPoint.x;

        // create time strings to be used for the display message
        let startTimeString = moment(startTime).format("HH:mm:ss");
        let endTimeString = moment(endTime).format("HH:mm:ss");

        // best to save time as unix time to localStorage
        startTime = moment(startTime).valueOf(); // get unix time value
        endTime = moment(endTime).valueOf(); // get unix time value

        let timerangeBookmarks = JSON.parse(localStorage.getItem("timerangeBookmarks")) || {}; // default to empty obj if it doesnt exist

        if (this.props.sensorName in timerangeBookmarks) {
            // sensor key already exists so add to it
            let currentBookmarkSensor = timerangeBookmarks[this.props.sensorName];

            // check if startTime Key exists
            if (startTime in currentBookmarkSensor) {
                // we append to the already created endTime array
                let endTimeArr = currentBookmarkSensor[startTime];
                endTimeArr.push(endTime);
            }
            else {
                // we create an endTime array with the value inside
                currentBookmarkSensor[startTime] = [endTime];
            }
        }
        else {
            // we need to init and add bookmark sensor to the json obj
            // startTime will be a key to an array of endTimes
            timerangeBookmarks[this.props.sensorName] = {[startTime]: [endTime]};
        }

        // convert to string before storing or else itll break
        timerangeBookmarks = JSON.stringify(timerangeBookmarks);
        localStorage.setItem('timerangeBookmarks', timerangeBookmarks);

        message.success('[' + this.props.sensorName + '-' + this.props.sensorID + '] ' +
            'Bookmarked: ' + startTimeString + ' - ' + endTimeString, 2.5);
    };

    render() {
        let isRunningState = (this.state.isRunning) ? 'Pause Chart' : 'Start Chart';

        return (
            <div>
                <div className="controls">
                    <Button type="primary" onClick={this.handleStartAndPause}>{isRunningState}</Button>
                    <Button onClick={this.handleBookmark}>Bookmark Start & End Timestamp</Button>
                </div>
                <div id={this.chartID}/>
            </div>
        );
    }
}

export default LiveDataTemplate;

// this format handles bookmarks with the same start time but multiple endTimes
// {
//     DHT-11: {
//      startTime: [endTime, endTime, ...],
//      startTime: [endTime, endTime, ...],
//      ...
//     },
//     ...
// }

