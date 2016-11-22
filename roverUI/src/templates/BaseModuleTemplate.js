import React, { Component } from 'react';

// wrapper class for Modules
class ModuleTemplate extends Component {
    render () {
        let moduleNameTag = this.props.moduleName ? <h3 className="module-name">{this.props.moduleName}</h3> : null; // default to null if no module name is supplied
        return (
            <div {...this.props} className="module">
                {moduleNameTag}
                {this.props.children}
            </div>
        )
    }
}

export default ModuleTemplate;