import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';

class RearCamera extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Rear Camera">
            <img src="http://192.168.1.74:8090/?action=stream" width="1280" height="720"/>
            </BaseModuleTemplate>
        );
    }
}

export default RearCamera;