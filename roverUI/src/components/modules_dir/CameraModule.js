import React, { Component } from 'react';
import ModuleTemplate from './ModuleTemplate';

class CameraModule extends Component {
    render() {
        return (
            <ModuleTemplate moduleName="Live Feeds">
                <h1>Front Camera</h1>
                <video width="1280" height="720" autoplay id="Front" />
                <h1>Rear Camera</h1>
                <video width="1280" height="720" autoplay id="Rear" />
                <script src = ""></script>
            </ModuleTemplate>
        );
    }
}

export default CameraModule;