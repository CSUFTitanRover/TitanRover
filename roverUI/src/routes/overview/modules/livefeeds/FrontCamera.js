import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';

class FrontCamera extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Front Camera">
                <h1>Front Camera</h1>
                <video width="1280" height="720" autoplay id="Front" />
                <script src = ""></script>
            </BaseModuleTemplate>
        );
    }
}

export default FrontCamera;