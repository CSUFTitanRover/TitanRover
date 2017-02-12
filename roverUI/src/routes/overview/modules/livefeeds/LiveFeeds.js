import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Link } from 'react-router';

class LiveFeeds extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Live Feeds">
                <Link activeClassName="active" to="/surround">
                    <button>360 Degree View</button>
                </Link>
                <Link activeClassName="active" to="/leftcamera">
                    <button>Left Camera</button>
                </Link>
                <Link activeClassName="active" to="/rightcamera">
                    <button>Right Camera</button>
                </Link>
                <Link activeClassName="active" to="/armcamera">
                    <button>Arm Camera</button>
                </Link>

                <Link activeClassName="active" to="/mastcamera">
                    <button>Mast Camera</button>
                </Link>
                {this.props.children}
            </BaseModuleTemplate>
        );
    }
}

export default LiveFeeds;
