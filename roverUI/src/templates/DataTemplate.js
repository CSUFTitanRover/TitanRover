import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import sensorsInfoDict from '../SensorsInfoDict';

class DataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect('127.0.0.1:6993'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            sensorsInfo: [], // array of Obj {name,id} for each sensor
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

        //let self = this; // preserve "this"

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
            options.push(<option value={sensorsInfoDict.get(key)} name={key}>{key}</option>);
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
        let newSensorsInfo = [];
        for(let selectedOption of e.target.selectedOptions) {
            newSensorsInfo.push({name: selectedOption.text, id: selectedOption.value});
        }

        this.setState({sensorsInfo: newSensorsInfo});
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
            sensorIds: this.state.sensorsInfo, // type Array[{name,id},{},...]
            queryByTimeRange: this.state.queryByTimeRange, // bool
            queryStartTime: queryStartTime, // int
            queryEndTime: queryEndTime //int
        };

        //console.info(queryEvent, data);
        // emit our appropriate query event to the homebase server
        this.socketClient.emit(queryEvent, data);
    }

    getSensorOptions() {
        let sensorsOptions = [];

        // function to return our html for each sensor
        let sensorTemplate = (sensorName, sensorId, sensorHideValue) => {
            return (
                <div className="sensor-option">
                    <span>{sensorName} ({sensorId})</span>


                    <input type="checkbox" name="Timestamp Range" onClick={this.handleTimeRangeClick}/>
                    <label for="Timestamp Range">Timestamp Range</label>

                    <div className={ShowOrHide}>
                        <input type="text" placeholder="Beginning Timestamp" name="queryStartTime" sensorId={sensorId}
                               onChange={this.handleInputChange}/>
                        <label>to</label>
                        <input type="text" placeholder="End Timestamp" name="queryEndTime" sensorId={sensorId}
                               onChange={this.handleInputChange}/>
                    </div>
                </div>
            )
        };

        // loop through and build a input fields for each sensor
        for(let sensor of this.state.sensorsInfo) {
            sensorsOptions.push(sensorTemplate(sensor['name'], sensor['id']));
        }
        return sensorsOptions;
    }

    render() {
        let dropdown_options = this.getDropdownOptions();

        let sensor_options = this.getSensorOptions();

        return (
            <BaseModuleTemplate moduleName="Query Chart Data">
                <div className="controls query-data">
                    <div>
                        <h4>Select Sensors (Multi-Select)</h4>
                        <select multiple name="Sensor Options" onChange={this.handleSensorOptionsChange}>
                            {dropdown_options}
                        </select>
                    </div>
                    <div className="options-border"/>
                    <div className="sensor-options">
                        <h4>Sensor Options</h4>

                        {sensor_options}
                    </div>
                    <button onClick={this.handleGetDataClick}>Get Data</button>
                </div>

                <div id={this.props.chartId} />
            </BaseModuleTemplate>
        );
    }
}


export default DataTemplate;

/*

 <input type="checkbox" name="Timestamp Range" onClick={this.handleTimeRangeClick}/>
 <label for="Timestamp Range">Timestamp Range</label>

    data being passed through Socket Client to Homebase_Server will look like:

    data = {
        sensorIds: [{name: 'All', id: 'all'}, {name: 'Decagon-5TE-Chart', id: '01'}, {name: 'DHT-11-Chart', id: '02'}], // type Array[{name,id},{},...]
        queryByTimeRange: true, // bool
        queryStartTime: 1598878971, // int
        queryEndTime: 1599999988 //int
    };

    TODO:
        - I need to organize the data so that each sensorData is being passed as its own Obj entity so that it look like:
             data = [
                {sensorIds: {name: 'Decagon-5TE-Chart', id: '01'}, // type Obj {}
                 queryByTimeRange: true, // bool
                 queryStartTime: 1598878971, // int
                 queryEndTime: 1599999988 //int
                 },
                 {sensorIds: {name: 'DHT-11-Chart', id: '02'}, // type Obj {}
                 queryByTimeRange: false, // bool
                 queryStartTime: null, // int
                 queryEndTime: null //int
                 },
                ...
             ];
        - This way it allows for multiple charts with different properties to be queried for their data.
        - This Querying Data Page is gonna be a biiiiiitchhhhhh since there's so much customization needed.
 */



