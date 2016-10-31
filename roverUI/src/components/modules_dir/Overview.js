import React, { Component } from 'react';
import Modules from '../../components/Modules_List';

class Overview extends Component {
    render() {
        return (
            <div>
                <Modules.Chart1/>
                <Modules.Module2/>
                <Modules.Chart2/>
                <Modules.Chart3/>
                <Modules.CameraModule/>
            </div>
        );
    }
}

export default Overview;