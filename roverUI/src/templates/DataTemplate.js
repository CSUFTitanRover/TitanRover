import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';


class DataTemplate extends Component {

    constructor(props) {
        super(props);

        this.socketClient = io.connect('localhost:8000'); // set client to connect to the port where the homebase server listens on
        this.state = {
            columns: this.props.chartInitialColumns,
            isRunning: true
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // initial render of the chart
        this._renderChart();

        // socket Event handlers
        let self = this; // preserve "this"
        let tempColumns = this.state.columns;

    }
    componentDidUpdate() {
        // load new data into our chart
        this.chart.load({
            columns: this.state.columns
        });
    }

    componentWillUnmount() {
        this.socketClient.disconnect(); // do we need to disconnect our current connection when we unmount our charts from the viewpage?
                                        // does this have any performance benefits?
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartId,
            data: {
                columns: this.state.columns, // defaults to 'line' if no chartType is supplied by nature of c3.js behavior
                type: this.props.chartType
            },
            zoom: {
                enabled: true
            },
            ...this.props.chartProps // additional chart properties
        });
    }

    handleClick() {
        // we need to get data from homebase server
        //this.socketClient.emit('get data');
    }

    render() {

        return (
            <div>
                <div id={this.props.chartId} />

                <div className="controls">
                    <form>
                        <div>
                            <input type="checkbox" name="id-search"/>
                            <label for="id-search">Get by ID</label>
                        </div>
                        <input type="searchbox"/>
                        <button onClick={this.handleClick}>Get Data</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default DataTemplate;



