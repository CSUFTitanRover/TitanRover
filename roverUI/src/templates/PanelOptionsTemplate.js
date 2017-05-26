import React, { Component } from 'react';
import moment from 'moment';
import { Button, Radio, Modal, TimePicker, message, Select, Cascader, Tooltip, Icon } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

class PanelOptionsTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queryAllData: true,
            queryByTimerange: false,
            queryStartTime: null,
            queryEndTime: null,

            modalVisible: false,
            tempStartTime: null, // temporary time holders for the time-pickers
            tempEndTime: null,    // temporary time holders for the time-pickers

            bookmarkToDelete: null
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
        this.handleBookmarkDeleteChange = this.handleBookmarkDeleteChange.bind(this);
        this.handleBookmarkDelete = this.handleBookmarkDelete.bind(this);
    }

    generateBookmarkOptions() {
        // Build bookmark options on mount
        let timerangeBookmarks = JSON.parse(localStorage.getItem("timerangeBookmarks"));

        for (let key in timerangeBookmarks) {
            if (timerangeBookmarks.hasOwnProperty(key)) {
                let obj = {value: key, label: key, children: [], key: this.uniqueKey++};
                this.buildBookmarkOption(obj.children, timerangeBookmarks[key]);
                this.options.push(obj);
            }
        }
    }

    // helper method with formatting bookmark options
    buildBookmarkOption(parentArr, objList) {
        for(let startTimeKey in objList) {
            if (objList.hasOwnProperty(startTimeKey)) {
                let temp = {
                    value: moment(parseInt(startTimeKey, 10)),
                    label: moment(parseInt(startTimeKey, 10)).format("HH:mm:ss"),
                    children: objList[startTimeKey].map(endTime => {
                        let endTimeObj = {value: moment(endTime), label: moment(endTime).format("HH:mm:ss")};
                        return endTimeObj;
                    })
                };

                parentArr.push(temp);
            }
        }
    }

    componentDidMount() {
        this.generateBookmarkOptions();

        this.extraBookmarkOptions = this.options.map(option => {
            return <Option value={option.label} key={this.uniqueKey++}>{option.label}</Option>
        });
    }

    handleRadioChange(event) {
        // swapping values based on event.target.value
        if (event.target.value === 'queryAllData') {
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
        if (label.length === 0) {
            return <span/>
        }
        else {
            return <span>{label[0] + ': ' + label[1] + ' - ' + label[2]}</span>
        }
    }

    handleBookmarkChange(value) {
        this.setState({tempStartTime: value[1], tempEndTime: value[2]})
    }

    handleBookmarkDeleteChange(value) {
        this.setState({bookmarkToDelete: value})
    }

    handleBookmarkDelete() {
        let timerangeBookmarks = JSON.parse(localStorage.getItem("timerangeBookmarks"));

        // we delete the bookmarked sensor and save
        delete timerangeBookmarks[this.state.bookmarkToDelete];
        localStorage.setItem("timerangeBookmarks", JSON.stringify(timerangeBookmarks));

        // resetting & re-generate bookmark options
        this.options = [];
        this.generateBookmarkOptions();

        // re-genertaing options
        this.extraBookmarkOptions = this.options.map(option => {
            return <Option value={option.label} key={this.uniqueKey++}>{option.label}</Option>
        });

        this.setState({bookmarkToDelete: null});
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
                    <div id="bookmark-options">
                        <div className="bookmarks">
                            <div style={{display: "flex"}}>
                                <h3 style={{marginRight: 7}}>Bookmarked Timestamps</h3>
                                <Tooltip title="Selecting bookmarked timestamps will autofill the time pickers">
                                    <Icon type="info-circle-o"/>
                                </Tooltip>
                            </div>

                            <Cascader options={this.options}
                                      style={{width: 200}}
                                      size="large"
                                      placeholder="Bookmarked Timestamps"
                                      onChange={this.handleBookmarkChange}
                                      displayRender={this.displayRender}
                            />
                        </div>
                        <div className="options">
                            <div style={{display: "flex"}}>
                                <h3 style={{marginRight: 7}}>Delete Bookmarks</h3>
                                <Tooltip title="Select a bookmarked sensor to delete all of its data">
                                    <Icon type="info-circle-o"/>
                                </Tooltip>
                            </div>

                            <Select value={this.state.bookmarkToDelete} style={{width: 150}} placeholder="Select Bookmarked Sensor" onChange={this.handleBookmarkDeleteChange}>
                                {this.extraBookmarkOptions}
                            </Select>
                            <Button type="danger" onClick={this.handleBookmarkDelete}>Delete Bookmarked Sensor</Button>
                        </div>
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

export default PanelOptionsTemplate;