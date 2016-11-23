import React, { Component } from 'react';
import c3 from 'c3';
//import io from 'socket.io-client';
import sensorsInfoDict from '../SensorsInfoDict';

class DataTemplate extends Component {

    constructor(props) {
        super(props);

        //this.socketClient = io.connect('localhost:8000'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            isRunning: true,
            queryByTimeRange: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleTimeRangeClick = this.handleTimeRangeClick.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        this._renderChart();

        // socket Event handlers
        let self = this; // preserve "this"
        let tempColumns = this.state.columns;

    }
    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            columns: this.state.columns
        });
    }

    componentWillUnmount() {
        //this.socketClient.disconnect(); // do we need to disconnect our current connection when we unmount our charts from the viewpage?
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

    handleClick(e) {

        let queryEvent = this.state.queryByTimeRange ? 'get: all data with timestamp range' : 'get: all data by id';
        // we need to get data from homebase server
        this.socketClient.emit(queryEvent);
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

    getDropdownOptions() {
        let options = '';

        //console.info(sensorsInfoDict);

        for(let key of sensorsInfoDict.keys()) {
            options += '<option value="' + sensorsInfoDict.get(key) + '">' + key + '</option>';

        }

        return options;
    }

    render() {
        let dropdown_options = this.getDropdownOptions();
        console.info(dropdown_options);

        let hideOrNot = this.state.queryByTimeRange ? null : 'hidden';

        return (
            <div>
                <div className="controls">
                    <select>
                        <option value="all">All</option>
                        {dropdown_options}
                    </select>

                    <input type="checkbox" name="Timestamp Range" onClick={this.handleTimeRangeClick}/>
                    <label for="Timestamp Range">Timestamp Range</label>

                    <div className={hideOrNot}>
                        <input type="text" placeholder="Beginning Timestamp"/>
                        <label>to</label>
                        <input type="text" placeholder="End Timestamp"/>
                    </div>

                    <button onClick={this.handleClick}>Get Data</button>
                </div>

                <div id={this.props.chartId} />
            </div>
        );
    }
}

export default DataTemplate;



