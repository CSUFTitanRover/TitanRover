import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';
import moment from 'moment';
import PanelOptions from './PanelOptionsTemplate';
import { Layout, Button, message, Tag, Select } from 'antd';
const { Content, Header } = Layout;
const Option = Select.Option;

class ChartPanelTemplate extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: null,
            dataKeys: null,
            queryAllData: true, // defualt value
            queryByTimerange: false // default value
        };
        this.uniqueKey = 0;
        this.socketClient = io.connect(rover_settings.homebase_ip);
        this.handleDeleteChartPanel = this.handleDeleteChartPanel.bind(this);
        this.queryData = this.queryData.bind(this);
        this.setDataToQuery = this.setDataToQuery.bind(this);
        this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        this.renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            self.socketClient.emit('set: client id', self.props.sensorID);
        });

        // events for Querying
        // receiving queried All Data from homebase
        this.socketClient.on('set: queryAllData', function(dataArray) {
            console.info('Receieved data from homebase!');
            console.info(dataArray);

            // first check if the query was unsuccessful
            if('errorMessage' in dataArray) {
                console.info('There was an error querying all the data!')
            }
            else {
                // building keys to display data by
                let keys = [];

                for(let key in dataArray[0]) {
                    if (dataArray[0].hasOwnProperty(key)) {
                        // add all keys in except for ID
                        if (!(key === 'id' || key === '_id')) {
                            keys.push(key);
                        }
                    }
                }

                self.setState({data: dataArray, dataKeys: keys})
            }
        });

        // So querying by timerange works but for some reason the time is 4 hours ahead?! Is it EST? Probelm with UTC?!
        // the data coming into the DB from the PI sensors is 4 hours ahead of the current time (Epoch time)...

        // receiving queried Time Range Data from homebase
        this.socketClient.on('set: queryByTimerange', function(dataArray) {
            console.info('Receieved data from homebase!');
            console.info(dataArray);

            // first check if the query was unsuccessful
            if('errorMessage' in dataArray) {
                console.info('There was an error querying by timerange!')
            }
            else {
                // building keys to display data by
                let keys = [];

                for(let key in dataArray[0]) {
                    if (dataArray[0].hasOwnProperty(key)) {
                        // add all keys in except for ID
                        if (!(key === 'id' || key === '_id')) {
                            keys.push(key);
                        }
                    }
                }

                self.setState({data: dataArray, dataKeys: keys})
            }
        });

    }

    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            json: this.state.data,
            keys: {
                x: 'timestamp',
                value: this.state.dataKeys,
            },
            unload: true // unload any previous data before loading new data
        });
    }

    renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartID,
            data: {
                columns: [],
                type: this.chartType// defaults to 'line' if no chartType is supplied by nature of c3.js behavior
            },
            size: {
                width: this.props.maxWidth
            },
            zoom: {
                enabled: true
            },
            subchart: {
                show: true
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S' // Error displaying Hour. It's not the correct hour
                    }
                }
            },
        });
    }

    handleDeleteChartPanel() {
        this.props.handleDeleteChartPanel(this.props.sensorName, this.props.panelKey);
    };

    queryData() {
        let dataToBeQueried = {sensorID: this.props.sensorID};

        if (this.state.queryAllData) {
            this.socketClient.emit('get: queryAllData', dataToBeQueried)
        }

        if (this.state.queryByTimerange) {

            // additional check if trying to queryByTimerange when no time is set
            if (this.state.queryStartTime == null || this.state.queryEndTime == null) {
                message.error('Can\'t query with empty timerange(s). Please go back and select a time value.', 2.5);
            }
            else {
                // we need to add the start and end timerange
                // ...dataToBeQueried uses the spread operator in es2015
                dataToBeQueried = {
                    ...dataToBeQueried,
                    queryStartTime: moment(this.state.queryStartTime).valueOf(), // need to convert to epoch time
                    queryEndTime: moment(this.state.queryEndTime).valueOf() // need to convert to epoch time
                };

                this.socketClient.emit('get: queryByTimerange', dataToBeQueried)
            }
        }

        console.info('Data to be queried:');
        console.info(JSON.stringify(dataToBeQueried, null, '\t'));
    }

    setDataToQuery(dataToQuery) {
        this.setState(dataToQuery);
    }

    handleChartTypeChange(value) {
        this.chartType = value;
        this.chart.transform(value);
    }

    render() {
        let chartTypes = ['line','spline','step','area','area-spline','area-step','bar','scatter','pie','donut','gauge'];
        let chartTypeOptions = chartTypes.map(type => <Option value={type} key={this.uniqueKey++}>{type} chart</Option>);

        return (
            <Layout>
                <Header className="controls">
                    <Tag color="blue">{this.props.chartID}</Tag>
                    <PanelOptions setDataToQuery={this.setDataToQuery}/>

                    <Select defaultValue={chartTypes[0]} style={{ width: 150 }} onChange={this.handleChartTypeChange}>
                        {chartTypeOptions}
                    </Select>

                    <Button type="primary" onClick={this.queryData}>Query Data</Button>
                    <Button type="danger" icon="close-circle-o" onClick={this.handleDeleteChartPanel}>Delete Current Chart Panel</Button>
                </Header>

                <Content>
                    <div id={this.props.chartID}/>
                </Content>
            </Layout>
        );
    }
}

export default ChartPanelTemplate;