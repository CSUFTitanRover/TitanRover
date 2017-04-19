import React, { Component } from 'react';
import { Tag } from 'antd';

// wrapper class for Modules
class ModuleTemplate extends Component {
    render () {
        let moduleNameTag = this.props.moduleName ? <Tag color={this.props.tagColor || "darkorange"}>{this.props.moduleName}</Tag> : null; // default to null if no module name is supplied
        return (
            <div {...this.props} className="module">
                {moduleNameTag}
                {this.props.children}
            </div>
        )
    }
}

export default ModuleTemplate;