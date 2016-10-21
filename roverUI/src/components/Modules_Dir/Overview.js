import React, { Component } from 'react';
import Module1 from './Module1';
import Module2 from './Module2';

class Overview extends Component {
    render() {
        return (
            <div>
                <Module1/>
                <Module2/>
            </div>
        );
    }
}

export default Overview;
