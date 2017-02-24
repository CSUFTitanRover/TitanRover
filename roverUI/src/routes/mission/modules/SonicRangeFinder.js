import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

class SonicRangeFinder extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="Sonic-Range-Finder Chart">
                <p>Range Values will go here</p>
            </BaseModuleTemplate>
        );
    }
}

export default SonicRangeFinder;

/*
 It's important to pass in the sensorName and sensorID exacly as it's typed in
 rover_settings.json to the LiveDataTemplate (it's case-sensitive)
 */