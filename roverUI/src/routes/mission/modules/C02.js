import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
// import LiveDataTemplate from '../../../templates/LiveDataTemplate';
import c3 from 'c3';

class C02 extends Component {
    constructor(props) {
        super(props);

        this.chartID = "co2-chart";
    }

    renderChart() {
        const data_rows = [
            ['C02 (PPM)'],
            [ '351' ],
            [ '351' ],
            [ '351' ],
            [ '351' ],
            [ '351' ],
            [ '351' ],
            [ '351' ],
            [ '351' ],
            [ '347' ],
            [ '334' ],
            [ '334' ],
            [ '334' ],
            [ '368' ],
            [ '368' ],
            [ '375' ],
            [ '375' ],
            [ '374' ],
            [ '374' ],
            [ '374' ],
            [ '427' ],
            [ '427' ],
            [ '431' ],
            [ '431' ],
            [ '483' ],
            [ '483' ],
            [ '483' ],
            [ '482' ],
            [ '482' ],
            [ '434' ],
            [ '434' ],
            [ '313' ],
            [ '313' ],
            [ '313' ],
            [ '310' ],
            [ '310' ],
            [ '337' ],
            [ '337' ],
            [ '312' ],
            [ '312' ],
            [ '312' ],
            [ '322' ],
            [ '322' ],
            [ '320' ],
            [ '320' ],
            [ '327' ],
            [ '327' ],
            [ '327' ],
            [ '328' ],
            [ '328' ],
            [ '330' ],
            [ '330' ],
            [ '324' ],
            [ '324' ],
            [ '324' ],
            [ '324' ],
            [ '324' ],
            [ '325' ],
            [ '325' ],
            [ '326' ],
            [ '326' ],
            [ '326' ],
            [ '329' ],
            [ '329' ],
            [ '328' ],
            [ '328' ],
            [ '324' ],
            [ '324' ],
            [ '324' ],
            [ '327' ],
            [ '327' ],
            [ '325' ],
            [ '325' ],
            [ '322' ],
            [ '322' ],
            [ '322' ],
            [ '317' ],
            [ '317' ],
            [ '313' ],
            [ '313' ],
            [ '315' ],
            [ '315' ],
            [ '315' ],
            [ '328' ],
            [ '328' ],
            [ '322' ],
            [ '322' ],
            [ '324' ],
            [ '324' ],
            [ '324' ],
            [ '326' ],
            [ '326' ],
            [ '325' ],
            [ '325' ],
            [ '321' ],
            [ '321' ],
            [ '321' ],
            [ '325' ],
            [ '325' ],
            [ '327' ],
            [ '327' ],
            [ '326' ],
            [ '326' ],
            [ '326' ],
            [ '322' ],
            [ '322' ],
            [ '324' ],
            [ '324' ],
            [ '327' ],
            [ '327' ],
            [ '327' ],
            [ '327' ],
            [ '327' ],
            [ '329' ],
            [ '329' ],
            [ '331' ],
            [ '331' ],
            [ '331' ],
            [ '330' ],
            [ '330' ],
            [ '332' ],
            [ '332' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '331' ],
            [ '331' ],
            [ '331' ],
            [ '331' ],
            [ '331' ],
            [ '331' ],
            [ '331' ],
            [ '332' ],
            [ '332' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '334' ],
            [ '334' ],
            [ '333' ],
            [ '333' ],
            [ '334' ],
            [ '334' ],
            [ '334' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '333' ],
            [ '334' ],
            [ '334' ],
            [ '336' ],
            [ '336' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '338' ],
            [ '338' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '338' ],
            [ '338' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '336' ],
            [ '336' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '337' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '336' ],
            [ '337' ],
            [ '337' ],
        ];

        this.chart = c3.generate({
            bindto: '#' + this.chartID.toString(),
            data: {
                rows: data_rows,
            },
            zoom: {
                enabled: true
            }
        });
    }

    componentDidMount() {
        // use maxWidth to hardcode chart width for performance
        // Note: This option should be specified if possible because it can improve its performance because
        // some size calculations will be skipped by an explicit value.
        // set maxWidth to 97% of main-content width. This handles any weird re-sizing quirks.
        this.maxWidth = document.querySelector('#main-content').clientWidth * 0.97;

        // initial render of the chart
        this.renderChart();
    }

    render() {
        return (
            <BaseModuleTemplate moduleName="C02 Chart">
                {/*<LiveDataTemplate*/}
                {/*sensorName="Decagon-5TE"*/}
                {/*sensorID="01"*/}
                {/*chartType="line"*/}
                {/*/>*/}

                <div id={this.chartID}/>
            </BaseModuleTemplate>
        );
    }
}

export default C02;

/*
 It's important to pass in the sensorName and sensorID exacly as it's typed in
 rover_settings.json to the LiveDataTemplate (it's case-sensitive)
 */