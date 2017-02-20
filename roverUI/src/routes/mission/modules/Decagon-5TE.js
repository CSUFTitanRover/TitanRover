import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

const initialCols = [
    ['EC'],
    ['VWC'],
    ['TempSoil']
];

class Decagon5TE extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="Decagon-5TE Chart">
                <LiveDataTemplate
                    sensorName="Decagon-5TE"
                    sensorID="01"
                    chartInitialColumns={initialCols}
                    chartType="line"
                />
            </BaseModuleTemplate>
        );
    }
}

export default Decagon5TE;

/*
    It's important to pass in the sensorName and sensorID exacly as it's typed in
    rover_settings.json to the LiveDataTemplate (it's case-sensitive)
 */