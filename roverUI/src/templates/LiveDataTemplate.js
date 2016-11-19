import React, { Component } from 'react';
import c3 from 'c3';
import io from 'socket.io-client';


class LiveDataTemplate extends Component {

    constructor(props) {
        super(props);

        this.ioClient = io.connect('http://localhost:8000'); // location where the server is ran
                                                            // don't know about manually setting where to connect the clients to...
        this.state = {
            columns: [],
            msg: null
        };
    }

    componentDidMount() {
        let self = this;
        this.ioClient.on('message', function(passed_msg){
            self.setState({msg: passed_msg});
        });

        this._renderChart();

    }
    componentDidUpdate() {
        //this._renderChart();
    }

    _renderChart() {
        this.chart = c3.generate({
            bindto: '#' + this.props.chartId,
            ...this.props.chartProps // additional chart properties
        });
    }

    render() {
        return (
            <div>
                {this.state.msg}
                <div id={this.props.chartId} />
            </div>
        );
    }
}

export default LiveDataTemplate;

/*
TODO:
- write the client side for socket io to see what requests are sent to React
- figure out the server side socket io for how that data is going to be sent to Client side
- 8 modules needed for the page!
 */