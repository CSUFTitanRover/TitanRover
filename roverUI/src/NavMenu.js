import React, { Component } from 'react';
import rover_settings from '../rover_settings.json';
import { Link } from 'react-router';
import { Menu, Icon } from  'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const sensorsList = rover_settings.sensorsList;

class NavMenu extends Component {
    render() {
        let sensorItemsGroup = sensorsList.map( (sensor) =>
            <Menu.Item key={sensor.sensorName}>
                <Link to={"/" + sensor.sensorName}>
                    <Icon type="eye-o" /> {sensor.sensorName}
                </Link>
            </Menu.Item>
        );

        // let currentLocation = this.props.location.pathname;
        // console.info('currentLocation: ' + currentLocation);

        return (
            <Menu
                mode="inline"
                theme="dark"
                defaultOpenKeys={['mission-critical', 'resources']}
            >
                <SubMenu key="mission-critical"
                         title={<span><Icon type="desktop"/> <span>Mission Critical</span></span>}>

                    <Menu.Item key="overview">
                        <Link to="/" onlyActiveOnIndex={true} activeClassName="hotfix-item-selected">
                            <Icon type="star-o" /> Overview
                        </Link>
                    </Menu.Item>

                    {sensorItemsGroup}

                    <Menu.Item key="cameras">
                        <Link to="/livefeeds">
                            <Icon type="camera-o" /> Cameras
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="arm-control">
                        <Link to="/arm-control">
                            <Icon type="user" /> Arm Control
                        </Link>
                    </Menu.Item>
                </SubMenu>

                <SubMenu key="resources"
                         title={<span><Icon type="paper-clip"/> <span>Resources</span></span>}>
                    <Menu.Item key="querydata">
                        <Link to="/querydata">
                            <Icon type="area-chart" /> Query Data
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="new-query">
                        <Link to="/new-query">
                            <Icon type="bar-chart" /> New Query
                        </Link>
                    </Menu.Item>
                </SubMenu>

            </Menu>
        )
    }
}

export default NavMenu;