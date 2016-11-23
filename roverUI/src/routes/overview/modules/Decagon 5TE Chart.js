import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import LiveDataTemplate from '../../../templates/LiveDataTemplate';
import sensorsInfoDict from '../../../SensorsInfoDict';

const clientID = sensorsInfoDict.get("Decagon-5TE-Chart");

const initialCols = [
    ['EC'],
    ['VWC'],
    ['TempSoil']
];

class Chart1 extends Component {

    render() {
        return (
            <BaseModuleTemplate moduleName="Decagon 5TE Chart">
                <LiveDataTemplate
                    chartID="Decagon-5TE-Chart"
                    chartInitialColumns={initialCols}
                    chartType="line"

                    clientID={clientID}
                />
            </BaseModuleTemplate>
        );
    }
}

export default Chart1;

/*
 * On the fly Documentation so I dont forget whats going on

     Additional Chart Props for more customization.

     const chartProps = {
     data: {
         columns: columns,
         types: {
         data1: 'area',
         data2: 'area-spline'
         }
     },
     zoom: {
        enabled: true
     }
     ...
     };

    This would be defined in Decagon 5TE Chart.js and passed as a prop
    like:

    <LiveDataTemplate
    ...
    chartProps={chartProps}
    />

 */