import React, { Component } from 'react';

class SensorOptionTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queryAllData: true,
            queryByTimeRange: false,
            queryStartTime: null,
            queryEndTime: null
        };

        this.handleAllDataChange = this.handleAllDataChange.bind(this);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillUnmount() {
        console.info( this.props.sensorName + (this.props.sensorID) + " unmounted");
    }
    handleAllDataChange() {
        if(this.state.queryAllData == false) {
            // switch from false to true
            if(this.state.queryByTimeRange) {
                // additional check
                this.setState({queryAllData: true, queryByTimeRange: false});
            }
            else {
                this.setState({queryAllData: true});
            }
        }
    }

    handleTimeRangeChange() {
        if(this.state.queryByTimeRange == false) {
            // switch from false to true
            if(this.state.queryAllData) {
                // additional check
                this.setState({queryByTimeRange: true, queryAllData: false});
            }
            else {
                this.setState({queryByTimeRange: true});
            }
        }
    }

    handleInputChange(event) {
        let stateName = event.target.name;
        this.setState({[stateName]: event.target.value});
    }

    render() {
        let ShowOrHide = this.state.queryByTimeRange ? 'timerange' : 'timerange hidden';

        // console.info('queryAllData: ' + this.state.queryAllData + '\nqueryByTimeRange: ' + this.state.queryByTimeRange + '\nqueryStartTime: ' + this.state.queryStartTime + '\nqueryEndTime: ' + this.state.queryEndTime);

        return (
            <div className="sensor-option">
                <span>{this.props.chartID}</span>


                <label for="All Data">
                    <input type="radio" name={this.props.chartID} value="allData" id="All Data" checked={this.state.queryAllData} onChange={this.handleAllDataChange}/>
                    Get All Data
                </label>


                <label for="Timestamp Range">
                    <input type="radio" name={this.props.chartID} value="timeRange" id="Timestamp Range" checked={this.state.queryByTimeRange} onChange={this.handleTimeRangeChange}/>
                    Timestamp Range
                </label>
                <div className={ShowOrHide}>
                    <input type="text" placeholder="Beginning Timestamp" name="queryStartTime"
                           onChange={this.handleInputChange}/>
                    <span>to</span>
                    <input type="text" placeholder="End Timestamp" name="queryEndTime"
                           onChange={this.handleInputChange}/>
                </div>
            </div>
        );
    }
}

export default SensorOptionTemplate;