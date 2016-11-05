import React, { Component } from 'react';

// wrapper class for Modules
class ModuleTemplate extends Component {
    render () {
        return (
            <div {...this.props} className="module">
                <h3 className="module-name">{this.props.moduleName}</h3>
                {this.props.children}
            </div>
        )
    }
}

export default ModuleTemplate;