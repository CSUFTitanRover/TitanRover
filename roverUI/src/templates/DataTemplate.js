import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import sensorsInfoDict from '../SensorsInfoDict';

class DataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect('127.0.0.1:6993'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            sensorIds: ['all'], // by default we get all sensors to graph,
            queryByTimeRange: false,
            queryStartTime: null,
            queryEndTime: null
        };

        this.handleGetDataClick = this.handleGetDataClick.bind(this);
        this.handleSensorOptionsChange = this.handleSensorOptionsChange.bind(this);
        this.handleTimeRangeClick = this.handleTimeRangeClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        this._renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // socket events from server-side to this client
        this.socketClient.on('set: all data by id', function(msg) {
            console.log(msg); // will replace with the methods to update the chart data
            // like so: self.setState({columns: data});
        });

        this.socketClient.on('set: all data with timestamp range', function(msg) {
            console.log(msg); // will replace with the methods to update the chart data
            // like so: self.setState({columns: data});
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
            bindto: '#' + this.props.chartId,
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

    // loader function for sensor options
    getDropdownOptions() {
        let options = [];

        // loop through our sensors from sensorsInfoDict and add to options drowdown
        for(let key of sensorsInfoDict.keys()) {
            options.push(<option value={sensorsInfoDict.get(key)}> {key} </option>);
        }

        return options;
    }

    handleTimeRangeClick() {
        if(this.state.queryByTimeRange) {
            // switch from true to false
            this.setState({queryByTimeRange: false});
        }
        else {
            this.setState({queryByTimeRange: true});
        }
    }

    handleSensorOptionsChange(e) {
        let newSensorIds = [];
        for(let selectedOption of e.target.selectedOptions) {
            newSensorIds.push(selectedOption.value);
        }
        this.setState({sensorIds: newSensorIds});
    }

    handleInputChange(e) {
        let stateName = e.target.name;
        this.setState({[stateName]: e.target.value});
    }

    handleGetDataClick() {

        let queryEvent = this.state.queryByTimeRange ? 'get: all data with timestamp range' : 'get: all data by id';
        let queryStartTime = this.state.queryByTimeRange ? this.state.queryStartTime : null; // set appropriate value if queryByTimeRange is true/false
        let queryEndTime = this.state.queryByTimeRange ? this.state.queryEndTime : null; // set appropriate value if queryByTimeRange is true/false

        let data = {
            sensorIds: this.state.sensorIds, // type Array[]
            queryByTimeRange: this.state.queryByTimeRange, // bool
            queryStartTime: queryStartTime, // int
            queryEndTime: queryEndTime //int
        };

        //console.log(data);

        // emit our appropriate query event to the homebase server
        this.socketClient.emit(queryEvent, data);

        // ********* THIS IS THE SECOND WAY FOR QUERYING DATA
        /*
        let myInit = {
            method: 'GET',
            headers: {
                'Content-Type': ''
            },
            mode: 'cors',
            cache: 'default'
        };

        let mySensorId = this.state.sensorIds[0];

        let myRequest = new Request('127.0.0.1:6993/getdata/' + mySensorId, myInit);

        fetch(myRequest).then(function(responseData) {
            this.setState({columns: responseData}); // set data recieved from the AJAX GET request
        });
        */

    }

    render() {
        let dropdown_options = this.getDropdownOptions();

        let hideOrNot = this.state.queryByTimeRange ? null : 'hidden';

        return (
            <div>
                <div className="controls">
                    <select multiple name="Sensor Options" onChange={this.handleSensorOptionsChange}>
                        <option value="all" selected="selected">All</option>
                        {dropdown_options}
                    </select>

                    <input type="checkbox" name="Timestamp Range" onClick={this.handleTimeRangeClick}/>
                    <label for="Timestamp Range">Timestamp Range</label>

                    <div className={hideOrNot}>
                        <input type="text" placeholder="Beginning Timestamp" name="queryStartTime" onChange={this.handleInputChange}/>
                        <label>to</label>
                        <input type="text" placeholder="End Timestamp" name="queryEndTime" onChange={this.handleInputChange}/>
                    </div>

                    <button onClick={this.handleGetDataClick}>Get Data</button>
                </div>

                <div id={this.props.chartId} />
            </div>
        );
    }
}

export default DataTemplate;



