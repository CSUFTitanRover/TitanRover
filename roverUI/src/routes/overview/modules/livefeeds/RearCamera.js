import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';

class RearCamera extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Rear Camera">
                <h1>Rear Camera</h1>
                <video width="1280" height="720" autoplay id="Rear" />
                <script src = ""></script>
            </BaseModuleTemplate>
        );
    }
}

export default RearCamera;