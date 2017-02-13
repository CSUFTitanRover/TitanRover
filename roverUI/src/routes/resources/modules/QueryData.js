import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import rover_settings from '../../../../rover_settings.json';
import QueryDataTemplate from '../../../templates/QueryDataTemplate';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Tabs, Panel} from 'react-tabtab';
import 'react-tabtab/public/stylesheets/folder.css';


// <QueryDataTemplate sensorName="Template-Tab" sensorID={i} keyIndex={i}/>


class QueryData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedSensorsData: [], // array of Obj {sensorName,sensorID} for each sensor
            activeKey: 0,
            data:  []
        };

        this.handleGenerateChart = this.handleGenerateChart.bind(this);
        this.handleSelectedOptionsChange = this.handleSelectedOptionsChange.bind(this);

        // Tabs Functions
        this.handleTabDeleteButton = this.handleTabDeleteButton.bind(this);
        this.handleTabClick = this.handleTabClick.bind(this);
        this.setMoveData = this.setMoveData.bind(this);
        this.handleDeleteAllButton = this.handleDeleteAllButton.bind(this);
        this.handleDeleteCurrentChart = this.handleDeleteCurrentChart.bind(this);
    }

    // Tabs Functions

    // Because the delete button only show on the active button
    // so when you receive the action, it means delete the active button data.
    handleTabDeleteButton() {
        let data = this.state.data;
        let activeKey = this.state.activeKey;

        data.splice(activeKey, 1); // delete the selected key

        // count the active key
        if (data.length <= activeKey + 1) {
            activeKey = data.length - 1;
        }

        this.setState({
            data: data,
            activeKey: activeKey
        });

    }

    handleDeleteAllButton() {
        this.setState({data: [], activeKey:0});
    }

    handleTabClick(key) {
        this.setState({activeKey: key})
    }

    setMoveData(dragIndex, hoverIndex) {
        let data = this.state.data;
        let dragData = data[dragIndex];
        data.splice(dragIndex, 1);
        data.splice(hoverIndex, 0, dragData);
        this.setState({data: data, activeKey: hoverIndex});
    }

    // Sensor Options

    getSensorOptionsData() {
        let options = [];
        let size = 0;

        for(let sensor of rover_settings.sensorsList) {
            options.push(<option value={sensor.sensorID} name={sensor.sensorName}>{sensor.sensorName}</option>);
            size++;
        }

        return {options: options, size: size};
    }

    handleSelectedOptionsChange(event) {
        let newSelectedSensorsData = [];
        for(let selectedOption of event.target.selectedOptions) {
            newSelectedSensorsData.push({sensorName: selectedOption.text, sensorID: selectedOption.value});
        }

        this.setState({selectedSensorsData: newSelectedSensorsData});
    }

    handleGenerateChart() {
        let selectedSensorsData = this.state.selectedSensorsData;
        let data = this.state.data;
        let sensorTabActiveKey = 0; // will hold activeKey for already generated tab to autofocus later

        for (let sensor of selectedSensorsData) {
            let sensorTabAlreadyGenerated = false;

            for (let [index, tab] of data.entries()) {
                if (sensor.sensorName === tab.title) {
                    sensorTabAlreadyGenerated = true;
                    sensorTabActiveKey = index;

                    // push to the content []
                    let keyIndex = tab.content.length;
                    let chartID = sensor.sensorName + '-' + sensor.sensorID + '-Index-' + keyIndex;
                    tab.content.push(<QueryDataTemplate sensorName={sensor.sensorName} sensorID={sensor.sensorID} keyIndex={keyIndex}
                                                        chartID={chartID} handleDeleteCurrentChart={this.handleDeleteCurrentChart}/>);

                    // auto-focus the already generated tab
                    this.setState({activeKey: sensorTabActiveKey});
                }
            }

            if (!sensorTabAlreadyGenerated) {
                let chartID = sensor.sensorName + '-' + sensor.sensorID + '-Index-' + 0;
                let content = [<QueryDataTemplate sensorName={sensor.sensorName} sensorID={sensor.sensorID} keyIndex={0}
                                                  chartID={chartID} handleDeleteCurrentChart={this.handleDeleteCurrentChart}/>];
                // generate the sensor tab
                this.handleAddBackTab(sensor.sensorName, content);
            }
        }
    }

    handleAddBackTab(title, content) {
        let data = this.state.data;
        data.push({title: title, content: content});
        this.setState({data: data, activeKey: data.length-1});
    }

    handleDeleteCurrentChart(sensorName, keyIndex) {
        let data = this.state.data;

        for (let [index, tab] of data.entries()) {
            if (sensorName === tab.title) {
                // we found our tab
                // now we check if there is only 1 chart panel inside
                if (tab.content.length === 1) {
                    // we need to delete the whole tab or else its going to be empty
                    this.handleTabDeleteButton();
                }
                else {
                    tab.content.splice(keyIndex, 1);
                }
            }
        }

        this.setState({data: data});
    }

    render() {
        let sensor_options_data = this.getSensorOptionsData();
        let sensor_options = sensor_options_data['options']; // only get the options for dropdown
        let options_dropdown_size = sensor_options_data['size']; // only get the size

        let panels = [];
        let data = this.state.data;
        for (let i in data) {
            let k = data[i];
            panels.push(
                <Panel title={k.title} key={i}>
                    {k.content}
                </Panel>
            );
        }

        return (
            <BaseModuleTemplate moduleName="Query Chart Data">
                <div className="controls sensor-options">
                    <div>
                        <h4>Select Sensors (Multi-Select)</h4>
                        <select multiple name="Sensor Options" size={options_dropdown_size} onChange={this.handleSelectedOptionsChange}>
                            {sensor_options}
                        </select>
                    </div>
                    <div className="options-border"/>
                    <button className="generate-chart-button" onClick={this.handleGenerateChart}>Generate Chart</button>
                </div>


                <Tabs activeKey={this.state.activeKey}
                      style="tabtab__folder__"
                      tabDeleteButton={true}
                      handleTabDeleteButton={this.handleTabDeleteButton}
                      draggable={false}
                      handleTabClick={this.handleTabClick}
                      setMoveData={this.setMoveData}
                      deleteAllButtonName="Delete All Tabs"
                      deleteAllButton={true}
                      handleDeleteAllButton={this.handleDeleteAllButton}
                >
                    {panels}
                </Tabs>

            </BaseModuleTemplate>
        );
    }
}

export default DragDropContext(HTML5Backend)(QueryData);

/*
 TODO:
 data being passed through Socket Client to Homebase_Server will look like:

 data = [
 {
 sensorInfo: {sensorName: 'Decagon-5TE-Chart', sensorID: '01'},
 queryByTimeRange: true, // bool
 queryStartTime: 1598878971, // int
 queryEndTime: 1599999988 //int
 },
 {
 sensorInfo: {sensorName: 'DHT-11-Chart', sensorID: '02'},
 queryByTimeRange: false, // bool
 queryStartTime: null, // int
 queryEndTime: null //int
 },
 ...
 ];


 TODO:
 for the content of each tab... we need to generate a chartPanel or append a new chartPanel if the tab is already generated.
 the chartPanel will consist of
    1) Form to query data
    2) Actual Chart to render queried data

    Tab
    |
    ----- Title
    |
    ----- Content
            |
            ----- ChartPanel
                    |
                    ----- Form to Query Data
                    |
                    ----- Chart to render data
 */
