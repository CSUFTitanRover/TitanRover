import React, { Component } from 'react';

class SensorOptionTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queryAllData: true,
            queryByTimeRange: false,
        };

        this.handleAllDataChange = this.handleAllDataChange.bind(this);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectedChartType = this.handleSelectedChartType.bind(this);
    }

    handleAllDataChange() {
        if(this.state.queryAllData == false) {
            // switch from false to true
            if(this.state.queryByTimeRange) {
                // additional check
                let newState = {queryAllData: true, queryByTimeRange: false};
                this.setState(newState);
                this.props.handleQueryByChange(newState);

            }
            else {
                let newState = {queryAllData: true};
                this.setState(newState);
                this.props.handleQueryByChange(newState);
            }
        }
    }

    handleTimeRangeChange() {
        if(this.state.queryByTimeRange == false) {
            // switch from false to true
            if(this.state.queryAllData) {
                // additional check
                let newState = {queryByTimeRange: true, queryAllData: false};
                this.setState(newState);
                this.props.handleQueryByChange(newState);
            }
            else {
                let newState = {queryByTimeRange: true};
                this.setState(newState);
                this.props.handleQueryByChange(newState);
            }
        }
    }

    handleInputChange(event) {
        this.props.handleInputChange(event.target.name, event.target.value);
    }

    handleSelectedChartType(event) {
        this.props.handleSelectedChartType(event.target.value)
    }

    render() {
        let ShowOrHide = this.state.queryByTimeRange ? 'timerange' : 'timerange hidden';

        return (
            <div className="sensor-option">
                <div>
                    <span className="sensor-label">{this.props.chartID}</span>

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

                <select name="Chart Type" className="chartType" onChange={this.handleSelectedChartType} title="If none are selected it defaults to Line Chart">
                    <option selected disabled>Chart Type</option>
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                </select>

            </div>
        );
    }
}

export default SensorOptionTemplate;