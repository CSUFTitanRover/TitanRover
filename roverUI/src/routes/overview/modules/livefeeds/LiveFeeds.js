import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Link } from 'react-router';

class LiveFeeds extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Live Feeds">
                <Link activeClassName="active" to="/frontcamera">
                    <button>Front Camera</button>
                </Link>

                <Link activeClassName="active" to="/rearcamera">
                    <button>Rear Camera</button>
                </Link>
                {this.props.children}
            </BaseModuleTemplate>
        );
    }
}

export default LiveFeeds;