import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import c3 from 'c3';
import io from 'socket.io-client';
import sensorsInfoDict from '../../../SensorsInfoDict';
import SensorOptionTemplate from '../../../templates/SensorOptionTemplate';

class QueryData extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect('127.0.0.1:6993'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            selectedSensorsInfo: [], // array of Obj {name,id} for each sensor,
            selectedSensorsOptions: [] // we need to keep track of our selected sensors to loop through and get its data
        };

        this.handleGetDataClick = this.handleGetDataClick.bind(this);
        this.handleSelectedOptionsChange = this.handleSelectedOptionsChange.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        //this._renderChart();

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
        /*
         this.chart.load({
         columns: this.state.columns
         });
         */
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
        let size = 0;
        // loop through our sensors from sensorsInfoDict and add to options drowdown
        for(let key of sensorsInfoDict.keys()) {
            options.push(<option value={sensorsInfoDict.get(key)} name={key}>{key}</option>);
            size++;
        }

        return {options: options, size: size};
    }

    handleSelectedOptionsChange(event) {
        let newSelectedSensorsInfo = [];
        for(let selectedOption of event.target.selectedOptions) {
            newSelectedSensorsInfo.push({name: selectedOption.text, id: selectedOption.value});
        }

        this.setState({selectedSensorsInfo: newSelectedSensorsInfo});
    }

    handleGetDataClick() {
        let data = {
            sensorIds: this.state.selectedSensorsInfo, // type Array[{name,id},{},...]
        };

        //console.info(queryEvent, data);
        // emit our appropriate query event to the homebase server
        this.socketClient.emit('queryEvent', data);
    }

    getSensorOptions() {
        let sensorOptions = [];

        // loop through and build a input fields for each sensor
        for(let sensor of this.state.selectedSensorsInfo) {
            sensorOptions.push(
                <SensorOptionTemplate sensorName={sensor['name']} sensorID={sensor['id']}/>
            );
        }
        return sensorOptions;
    }

    render() {
        let dropdown_data = this.getDropdownOptions();
        let dropdown_options = dropdown_data['options']; // only get the options for dropdown
        let dropdown_size = dropdown_data['size']; // only get the size

        let sensor_options = this.getSensorOptions();

        return (
            <BaseModuleTemplate moduleName="Query Chart Data">
                <div className="controls query-data">
                    <div>
                        <h4>Select Sensors (Multi-Select)</h4>
                        <select multiple name="Sensor Options" size={dropdown_size} onChange={this.handleSelectedOptionsChange}>
                            {dropdown_options}
                        </select>
                    </div>
                    <div className="options-border"/>
                    <div className="sensor-options">
                        <h4>Sensor Options</h4>
                        <div className="options-container">
                            {sensor_options}
                        </div>
                    </div>
                    <div className="options-border"/>
                    <button onClick={this.handleGetDataClick}>Get Data</button>
                </div>

                <div id="chart-id"/>
            </BaseModuleTemplate>
        );
    }
}


export default QueryData;

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
 - I've gotten unqiue chart props for each sensor. Now I just need to save that data in the format from above.

 BUGS:
 - The First Sensor Options Persists its own data since there will always be 1 element in the Sensor Options. Its an annoying bug but not mission-threatening.
 
 */



