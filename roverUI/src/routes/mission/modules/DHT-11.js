import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';

class DHT11 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="DHT-11 Chart">
                <LiveDataTemplate
                    sensorName="DHT-11"
                    sensorID="02"
                    chartType="line"
                />
            </BaseModuleTemplate>
        );
    }
}

export default DHT11;