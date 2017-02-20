import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

const initialCols = [
    ['First'],
    ['Second'],
    ['Third']
];

class SonicRangeFinder extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="Sonic-Range-Finder Chart">
                <LiveDataTemplate
                    sensorName="Sonic-Range-Finder"
                    sensorID="03"
                    chartInitialColumns={initialCols}
                    chartType="line"
                />
            </BaseModuleTemplate>
        );
    }
}

export default SonicRangeFinder;

/*
 It's important to pass in the sensorName and sensorID exacly as it's typed in
 rover_settings.json to the LiveDataTemplate (it's case-sensitive)
 */