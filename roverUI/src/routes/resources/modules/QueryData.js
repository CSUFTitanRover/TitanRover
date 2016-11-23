import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import DataTemplate from '../../../templates/DataTemplate';

const initialCols = [
    ['data1'],
    ['data2']
];

class QueryData extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Query Chart Data">

                <DataTemplate
                    chartId="Decagon-5TE-Chart"
                    chartInitialColumns={initialCols}
                    chartType="bar"
                />

            </BaseModuleTemplate>
        );
    }
}

export default QueryData;