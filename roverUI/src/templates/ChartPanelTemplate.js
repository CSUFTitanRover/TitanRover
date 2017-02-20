import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';
import { Layout, Button, Radio, Modal, TimePicker, message, Tag, Select } from 'antd';
const { Content, Header } = Layout;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

class PanelOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queryAllData: true,
            queryByTimerange: false,
            queryStartTime: null,
            queryEndTime: null,

            modalVisible: false,
            tempStartTime: null, // temporary time holders for the time-pickers
            tempEndTime: null    // temporary time holders for the time-pickers
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    }

    handleOnChange(event) {
        // swapping values based on event.target.value
        if (event.target.value == 'queryAllData') {
            this.setState({
                queryAllData: true,
                queryByTimerange: false
            });
            this.props.setDataToQuery({queryAllData: true, queryByTimerange: false});
        }
        else {
            this.setState({
                queryAllData: false,
                queryByTimerange: true
            });
            this.props.setDataToQuery({queryAllData: false, queryByTimerange: true});
        }
    }

    showModal() {
        // set start and end time to old values if the user cancels modal
        this.setState({modalVisible: true, tempStartTime: this.state.queryStartTime, tempEndTime:this.state.queryEndTime});
    };

    handleOk() {
        // check for trying to set null times
        if (this.state.tempStartTime == null || this.state.tempEndTime == null) {
            message.error('Can\'t save empty time. Please select a time value.');
        }
        else {
            // we set new time changes
            this.setState({
                modalVisible: false,
                queryStartTime: this.state.tempStartTime,
                queryEndTime: this.state.tempEndTime
            });
            this.props.setDataToQuery({queryStartTime: this.state.tempStartTime, queryEndTime: this.state.tempEndTime});
        }
    }

    handleCancel() {
        // we discard time changes
        this.setState({modalVisible: false});
    }

    handleStartTimeChange(time) {
        this.setState({tempStartTime: time})
    }

    handleEndTimeChange(time) {
        this.setState({tempEndTime: time})
    }

    render() {
        return (
            <div>
                <RadioGroup onChange={this.handleOnChange} defaultValue="queryAllData">
                    <RadioButton value="queryAllData">Query All Data</RadioButton>
                    <RadioButton value="queryByTimerange" onClick={this.showModal}>Query By Timerange</RadioButton>
                </RadioGroup>

                <Modal title="Query By Timerange Settings" visible={this.state.modalVisible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                       okText="Good to go!" cancelText="Don't save settings"
                       maskClosable={false} className="queryByTimerange-settings"
                >
                    <div className="time-picker">
                        <h3>Start Time</h3>
                        <TimePicker value={this.state.tempStartTime} onChange={this.handleStartTimeChange} placeholder="Start Time"
                            addon={panel => (
                                <Button size="small" type="primary" onClick={() => panel.close()}>
                                    Ok
                                </Button>
                            )}
                        />
                    </div>

                    <div className="time-picker">
                        <h3>End Time</h3>
                        <TimePicker value={this.state.tempEndTime} onChange={this.handleEndTimeChange} placeholder="End Time"
                            addon={panel => (
                                <Button size="small" type="primary" onClick={() => panel.close()}>
                                Ok
                                </Button>
                            )}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

class ChartPanelTemplate extends Component {
    constructor(props){
        super(props);

        this.state = {
            columns: [],
            queryAllData: true, // defualt value
            queryByTimerange: false // default value
        };

        this.socketClient = io.connect(rover_settings.homebase_ip);
        this.handleDeleteChartPanel = this.handleDeleteChartPanel.bind(this);
        this.queryData = this.queryData.bind(this);
        this.setDataToQuery = this.setDataToQuery.bind(this);
        this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
    }

    componentDidMount() {
        // use maxWidth to hardcode chart width for performance
        // Note: This option should be specified if possible because it can improve its performance because
        // some size calculations will be skipped by an explicit value.
        this.maxWidth = document.querySelector('#main-content').clientWidth - 60;

        // initial render of the chart
        this._renderChart();

        let self = this; // preserve "this"

        // socket Event handlers
        // event for inital socket connection to set client id for future use on server-side
        this.socketClient.on('get: client id', function () {
            self.socketClient.emit('set: client id', self.props.sensorID);
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
                self.setState({columns: jsonObj})
            }
        });
        // receiving queried Time Range Data from homebase
        this.socketClient.on('set: queryByTimerange', function(jsonObj) {
            console.info('Receieved data from homebase!');
            console.info(jsonObj);

            // first check if the query was unsuccessful
            if('errorMessage' in jsonObj) {
                console.info('There was an error querying by timerange!')
            }
            else {
                // set state of the new columns
                self.setState({columns: jsonObj})
            }
        });

    }

    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            columns: this.state.columns
        });
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartID,
            data: {
                columns: this.state.columns,
                type: this.chartType// defaults to 'line' if no chartType is supplied by nature of c3.js behavior
            },
            size: {
                width: this.maxWidth
            },
            zoom: {
                enabled: true
            }
        });
    }

    handleDeleteChartPanel() {
        this.props.handleDeleteChartPanel(this.props.sensorName, this.props.panelKey);
    };

    queryData() {

        //    to be COMPLETED
        console.info(this.state);

        let dataToBeQueried = {sensorID: this.props.sensorID};

        if (this.state.queryAllData) {
            this.socketClient.emit('get: queryAllData', dataToBeQueried)
        }
        else {

            // additional check if trying to queryByTimerange when no time is set
            if (this.state.queryStartTime == null || this.state.queryEndTime == null) {
                message.error('Can\'t query with empty timerange(s). Please go back and select a time value.', 2.5);
            }
            else {
                // we need to add the start and end timerange
                // ...dataToBeQueried uses the spread operator in es2015
                dataToBeQueried = {
                    ...dataToBeQueried,
                    queryStartTime: this.state.queryStartTime,
                    queryEndTime: this.state.queryEndTime
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
        let chartTypeOptions = chartTypes.map(type => <Option value={type}>{type} chart</Option>);

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