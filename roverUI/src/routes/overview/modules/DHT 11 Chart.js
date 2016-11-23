import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';
import sensorsInfoDict from '../../../SensorsInfoDict';

const clientID = sensorsInfoDict.get("DHT-11-Chart");

const initialCols = [
    ['Humidity'],
    ['TempOutside']
];

class Chart2 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="DHT 11 Chart">
                <LiveDataTemplate
                    chartID="DHT-11-Chart"
                    chartInitialColumns={initialCols}
                    chartType="bar"

                    clientID={clientID}
                />
            </BaseModuleTemplate>
        );
    }
}

export default Chart2;