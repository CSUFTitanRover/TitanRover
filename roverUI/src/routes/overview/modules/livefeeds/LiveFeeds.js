import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Link } from 'react-router';

class LiveFeeds extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Live Feeds">
                <Link activeClassName="active" to="/frontcamera">
                    <span className="link-text">Front Camera</span>
                </Link>

                <Link activeClassName="active" to="/rearcamera">
                    <span className="link-text">Rear Camera</span>
                </Link>
                {this.props.children}
            </BaseModuleTemplate>
        );
    }
}

export default LiveFeeds;