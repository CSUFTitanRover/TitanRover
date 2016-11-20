import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';


class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect('localhost:8000'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns
        };
    }

    componentDidMount() {
        // initial render of the chart
        this._renderChart();

        // socket Event handlers
        let self = this; // preserve "this"
        let tempColumns = this.state.columns;
        this.socketClient.on('update: chart data', function(data) {
            console.log('update: chart data, CALLED');

            // index of data[]
            let i = 0;

            // loop over each col in columns
            for(let col of tempColumns) {
                // only allow 6 entries to be visible on the chart
                // remove first entry and append new entry
                if(col.length > 6) {
                    col.splice(1, 1); // remove entry in index 1 (first data entry)
                    col.push(data[i]);
                    i++;
                }
                // append new entry
                else {
                    col.push(data[i]);
                    i++
                }
            }

            console.info(tempColumns);

            // update columns state
            self.setState({columns: tempColumns});
        });

    }
    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            columns: this.state.columns
        });
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartId,
            type: this.props.chartType,
            data: {
                columns: this.state.columns
            },
            ...this.props.chartProps // additional chart properties
        });
    }

    render() {
        return (
            <div id={this.props.chartId} />
        );
    }
}

export default LiveDataTemplate;

/*
TODO:
- 8 modules needed for the page!
 */


