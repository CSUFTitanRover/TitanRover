import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import ChartPanelTemplate from '../../../templates/ChartPanelTemplate';
import rover_settings from '../../../../rover_settings.json';
import { Select, Button, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const sensorsList = rover_settings.sensorsList;

class ChartGenerationOptions extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnDeselect = this.handleOnDeselect.bind(this);
    }

    componentWillMount() {
        // populate Select with Options loaded from sensorsList right before the Component Mounts
        this.generationOptions = sensorsList.map( (sensor) =>
            <Option key={sensor.sensorID} sensorName={sensor.sensorName.toLowerCase()}>{sensor.sensorName}</Option>
        );
    }

    handleOnSelect(value) {
        this.props.handleOnSelect(value);
    }

    handleOnDeselect(value) {
        this.props.handleOnDeselect(value);
    }


    render() {
        return (
            <Select className="generation-options" multiple onSelect={this.handleOnSelect} onDeselect={this.handleOnDeselect}
                    optionFilterProp="sensorName" placeholder="Select sensors to generate chart">
                {this.generationOptions}
            </Select>
        );
    }
}

class QueryData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGenerationOptions: [],
            panes: [],
        };

        this.uniqueIndexKey = 0; // used for assigning unique keys to Elements inside arrays
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnDeselect = this.handleOnDeselect.bind(this);
        this.handleGenerateChartPanels = this.handleGenerateChartPanels.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleDeleteChartPanel = this.handleDeleteChartPanel.bind(this);
    }

    componentDidMount() {
        // use maxWidth to hardcode chart width for performance
        // Note: This option should be specified if possible because it can improve its performance because
        // some size calculations will be skipped by an explicit value.
        // set maxWidth to 97% of main-content width. This handles any weird re-sizing quirks.
        this.maxWidth = document.querySelector('#main-content').clientWidth * 0.97;

    }

    // functions for Select and Button
    handleOnSelect(value) {
        let selectedGenerationOptions = this.state.selectedGenerationOptions;
        selectedGenerationOptions.push(value);

        this.setState({selectedGenerationOptions: selectedGenerationOptions});
    }

    handleOnDeselect(value) {
        let selectedGenerationOptions = this.state.selectedGenerationOptions;
        let index = selectedGenerationOptions.indexOf(value);
        selectedGenerationOptions.splice(index, 1);

        this.setState({selectedGenerationOptions: selectedGenerationOptions});
    }

    handleGenerateChartPanels() {
        let panes = this.state.panes;
        let activeKey;
        let chartPanelInfo = [];

        // assign sensorName and sensorIDs by keyID
        for(let keyID of this.state.selectedGenerationOptions) {
            for(let sensor of rover_settings.sensorsList) {
                if (keyID === sensor.sensorID) {
                    chartPanelInfo.push(sensor);
                }
            }
        }

        // we loop over every pane
        for(let sensor of chartPanelInfo) {
            let paneAlreadyExists = false;
            for(let pane of panes) {
                // the pane already exists so we append to its content a new chart panel
                if (sensor.sensorName === pane.title) {
                    paneAlreadyExists = true;
                    // let chartPanelKey = pane.content.length;
                    let chartPanelKey = this.uniqueIndexKey++;

                    let chartID = (sensor.sensorName + '-' + sensor.sensorID + '-Key-' + chartPanelKey).toString();

                    // we set key and panelIndex to the same value because it's necessary that a unique key is passed
                    // in when creating an array of elements in React. This prevents any re-render issues on changes
                    let chartPanelTemplate = (
                        <ChartPanelTemplate sensorName={sensor.sensorName} sensorID={sensor.sensorID}
                                            chartID={chartID} key={chartPanelKey} panelKey={chartPanelKey}
                                            handleDeleteChartPanel={this.handleDeleteChartPanel} maxWidth={this.maxWidth}
                        />
                    );
                    pane.content.push({panel:chartPanelTemplate, panelKey:chartPanelKey});
                    activeKey = pane.key;
                }
            }

            // extra check for paneAlreadyExists
            if (!paneAlreadyExists) {
                // this means we need to create a new pane
                let chartPanelKey = this.uniqueIndexKey++;
                let chartID = (sensor.sensorName + '-' + sensor.sensorID + '-Key-' + chartPanelKey).toString();
                let paneKey = (this.uniqueIndexKey++).toString(); // increment newTabIndex to create a new unique key for each pane
                let chartPanelTemplate = (
                    <ChartPanelTemplate sensorName={sensor.sensorName} sensorID={sensor.sensorID}
                                        chartID={chartID} key={chartPanelKey} panelKey={chartPanelKey}
                                        handleDeleteChartPanel={this.handleDeleteChartPanel} maxWidth={this.maxWidth}
                    />
                );
                let content = [{panel:chartPanelTemplate, panelKey:chartPanelKey}];
                panes.push({title: sensor.sensorName, content: content, key: paneKey});
                activeKey = paneKey;
            }
        }

        // update any changes
        this.setState({panes, activeKey: activeKey});
    }

    handleDeleteChartPanel(targetName, targetKey) {
        let panes = this.state.panes;

        for (let pane of panes) {
            if (targetName === pane.title) {
                // create new content array without the targetKey's panel
                let newContent= pane.content.filter(obj => obj.panelKey !== targetKey);

                // should delete current tab BUUTT
                // it doesn't... instead it auto-focuses the prev Tab
                // Let's just call it a feature ;)
                // if there's no more content then we auto-focus prev tab
                if (newContent.length === 0) {
                    this.remove(pane.key)
                }
                pane.content = newContent;
            }
        }

        this.setState({panes});
    };


    // functions for Tabs and TabPanes
    handleOnChange(activeKey) {
        this.setState({activeKey});
    }

    handleOnEdit(targetKey, action) {
        this[action](targetKey);
    }

    remove(targetKey) {
        let activeKey = this.state.activeKey;
        let panes;
        let targetIndex;

        // find index of the targetKey
        for(let [index, pane] of this.state.panes.entries()) {
            let paneKeyInt = parseInt(pane.key, 10);
            let targetKeyInt = parseInt(targetKey, 10);

            if (paneKeyInt === targetKeyInt) {
                targetIndex = index;
            }
        }

        // remove the target from panes
        panes = this.state.panes.filter(pane => pane.key !== targetKey);

        // handle auto-focusing tabs on removal
        if (targetIndex >= 1 && activeKey === targetKey) {
            activeKey = panes[targetIndex-1].key;
        }
        else if (targetIndex === 0) {
            if (panes.length === 0) {
                activeKey = null;
            }
            else {
                activeKey = panes[targetIndex].key;
            }
        }

        this.setState({panes: panes, activeKey});
    }

    render() {

        let panes = [];

        for (let pane of this.state.panes) {
            // looping through every panel obj and only getting it's panel content
            let contentPanels = [];
            for (let obj of pane.content) {
                contentPanels.push(obj.panel);
            }

            panes.push(<TabPane tab={pane.title} key={pane.key}>{contentPanels}</TabPane>)
        }

        return (
            <BaseModuleTemplate moduleName="New Query">
                <div className="controls">
                    <ChartGenerationOptions handleOnSelect={this.handleOnSelect} handleOnDeselect={this.handleOnDeselect}/>
                    <Button type="primary" onClick={this.handleGenerateChartPanels}>Generate Charts</Button>
                </div>

                <div id="chart-panels">
                    <Tabs
                        hideAdd
                        activeKey={this.state.activeKey}
                        type="editable-card"
                        onChange={this.handleOnChange}
                        onEdit={this.handleOnEdit}
                        animated={false}
                    >
                        {panes}
                    </Tabs>
                </div>
            </BaseModuleTemplate>
        );
    }
}

export default QueryData;