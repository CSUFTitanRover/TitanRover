import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';
import rover_settings from '../../rover_settings.json';
import moment from 'moment';
import { Layout, Button, Radio, Modal, TimePicker, message, Tag, Select, Cascader } from 'antd';
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
        this.options = [];
        this.uniqueKey = 0; // used so React doesn't yell at you for not suppling a unique key to an obj in an array
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
        this.handleBookmarkChange = this.handleBookmarkChange.bind(this);
        this.displayRender = this.displayRender.bind(this);
    }

    // helper method with formatting bookmark options
    buildBookmarkOption(parentArr, objList) {
        for(let startTimeKey in objList) {
            let temp = {
                value: moment(parseInt(startTimeKey)),
                label: moment(parseInt(startTimeKey)).format("HH:mm:ss"),
                children: objList[startTimeKey].map(endTime => {
                    let endTimeObj = {value: moment(endTime), label: moment(endTime).format("HH:mm:ss")};
                    return endTimeObj;
                })
            };

            parentArr.push(temp);
        }
    }

    componentDidMount() {
        // Build bookmark options on mount
        let timerangeBookmarks = JSON.parse(localStorage.getItem("timerangeBookmarks"));

        for (let key in timerangeBookmarks) {
            let obj = {value: key, label: key, children: [], key: this.uniqueKey++};
            this.buildBookmarkOption(obj.children, timerangeBookmarks[key]);
            this.options.push(obj);
        }
    }

    handleRadioChange(event) {
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

    displayRender(label) {
        if (label.length == 0) {
            return <span/>
        }
        else {
            return <span>{label[0] + ': ' + label[1] + ' - ' + label[2]}</span>
        }
    }

    handleBookmarkChange(value) {
        this.setState({tempStartTime: value[1], tempEndTime: value[2]})
    }


    render() {
        return (
            <div>
                <RadioGroup onChange={this.handleRadioChange} defaultValue="queryAllData">
                    <RadioButton value="queryAllData">Query All Data</RadioButton>
                    <RadioButton value="queryByTimerange" onClick={this.showModal}>Query By Timerange</RadioButton>
                </RadioGroup>

                <Modal title="Query By Timerange Settings" visible={this.state.modalVisible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                       okText="Good to go!" cancelText="Don't save settings"
                       maskClosable={false} className="queryByTimerange-settings"
                >
                    <div>
                        <h3>Bookmarked Timestamps - Autofill Time Pickers</h3>
                        <Cascader options={this.options}
                                  style={{ width: 270 }}
                                  size="large"
                                  placeholder="Bookmarked Timestamps"
                                  onChange={this.handleBookmarkChange}
                                  displayRender={this.displayRender}
                        />
                    </div>

                    <div className="time-pickers">
                        <div>
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