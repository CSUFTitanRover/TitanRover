import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import sensorsInfoDict from '../../../SensorsInfoDict';
import rover_settings from '../../../../rover_settings.json';

import SensorOptionTemplate from '../../../templates/SensorOptionTemplate';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Tabs, Panel} from 'react-tabtab';
import 'react-tabtab/public/stylesheets/folder.css';


class QueryData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedSensorsData: [], // array of Obj {sensorName,sensorID} for each sensor

            activeKey: 0,
            data:  [
                {
                    title: "Decagon-5TE-Chart",
                    content: "Content 1. Chart template will go here with options to query the DB and graph the data base on timestamp or all data."
                },
                {
                    title: "DHT-11-Chart",
                    content: "Content 2. Chart template will go here with options to query the DB and graph the data base on timestamp or all data."
                },
                {
                    title: "Sensor-Name-Chart",
                    content: "Content 3. Chart template will go here with options to query the DB and graph the data base on timestamp or all data."
                }
            ]
        };

        this.handleGenerateChart = this.handleGenerateChart.bind(this);
        this.handleSelectedOptionsChange = this.handleSelectedOptionsChange.bind(this);

        // Tabs Functions
        this.handleTabDeleteButton = this.handleTabDeleteButton.bind(this);
        this.handleTabClick = this.handleTabClick.bind(this);
        this.setMoveData = this.setMoveData.bind(this);
        this.handleDeleteAllButton = this.handleDeleteAllButton.bind(this);
    }

    // Tabs Functions

    // Because the delete button only show on the active button
    // so when you receive the action, it means delete the active button data.
    handleTabDeleteButton() {
        var data = this.state.data;
        var activeKey = this.state.activeKey;
        data.splice(activeKey, 1); // delete the selected key
        // count the active key
        if (data.length <= activeKey + 1)
            activeKey = data.length - 1;
        this.setState({
            data: data,
            activeKey: activeKey
        })
    }

    handleDeleteAllButton() {
        this.setState({data: [], activeKey:0});
    }

    handleTabClick(key) {
        this.setState({activeKey: key})
    }

    beginDrag() {
        console.log('begin drag')
    }

    setMoveData(dragIndex, hoverIndex) {
        var data = this.state.data;
        var dragData = data[dragIndex];
        data.splice(dragIndex, 1);
        data.splice(hoverIndex, 0, dragData);
        this.setState({data: data, activeKey: hoverIndex});
    }

    handleAddBackTab() {
        var data = this.state.data;
        var title = "Tab";
        var content = "Some content";
        data.push({title: title, content: content});
        this.setState({data: data, activeKey: data.length-1});
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
        return;
    }


    render() {
        let sensor_options_data = this.getSensorOptionsData();
        let sensor_options = sensor_options_data['options']; // only get the options for dropdown
        let options_dropdown_size = sensor_options_data['size']; // only get the size

        var panel = [];
        var data = this.state.data;
        for (var i in data) {
            var k = data[i];
            panel.push(
                <Panel title={k.title} key={i}>
                    {k.content}
                </Panel>
            );
        }

        return (
            <BaseModuleTemplate moduleName="Query Chart Data">
                <div className="controls query-data">
                    <div>
                        <h4>Select Sensors (Multi-Select)</h4>
                        <select multiple name="Sensor Options" size={options_dropdown_size} onChange={this.handleSelectedOptionsChange}>
                            {sensor_options}
                        </select>
                    </div>
                    <div className="options-border"/>
                    <button onClick={this.handleGenerateChart}>Generate Chart</button>
                </div>


                <Tabs activeKey={this.state.activeKey}
                      style={"tabtab__" + 'folder' +"__"}
                      handleAddBackClick={this.handleAddBackTab}
                      tabDeleteButton={true}
                      handleTabDeleteButton={this.handleTabDeleteButton}
                      draggable={true}
                      beginDrag={this.beginDrag}
                      handleTabClick={this.handleTabClick}
                      setMoveData={this.setMoveData}
                      deleteAllButtonName="Delete All Tabs"
                      deleteAllButton={true}
                      handleDeleteAllButton={this.handleDeleteAllButton}
                >
                    {panel}
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
 */
