import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';

class FrontCamera extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Front Camera">
            <img src="http://192.168.1.74:8080/?action=stream" width="1280" height="720"/>
            </BaseModuleTemplate>
        );
    }
}

export default FrontCamera;