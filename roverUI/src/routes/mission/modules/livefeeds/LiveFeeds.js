import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Link } from 'react-router';
import { Button } from 'antd';
const ButtonGroup = Button.Group;

// maybe remove tabs? tabs can be slow for swapping components.

class LiveFeeds extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Live Feeds">
                <ButtonGroup>
                    <Button type="primary">
                        <Link activeClassName="active" to="/surround">
                            360 Degree View
                        </Link>
                    </Button>

                    <Button type="primary">
                        <Link activeClassName="active" to="/armcamera">
                            Arm Camera
                        </Link>
                    </Button>

                    <Button type="primary">
                        <Link activeClassName="active" to="/frontcamera">
                            Front Camera
                        </Link>
                    </Button>
                </ButtonGroup>

                {this.props.children}
            </BaseModuleTemplate>
        );
    }
}

export default LiveFeeds;
