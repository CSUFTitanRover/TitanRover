import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Button, Row, Col, message, Input, Card, Table, Modal, Tabs, Select } from 'antd';
import io from 'socket.io-client';
import rover_settings from '../../../../../rover_settings.json';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import ZoomDisplay from 'react-leaflet-zoom-display';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geolib from 'geolib';


// Needed in order to provide the correct path to marker images
// https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

class DecimalWaypointMarker extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Input addonBefore="latitude" value={this.props.decimal_lat} onChange={this.props.handleLatChange} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Input addonBefore="longitude" value={this.props.decimal_lng} onChange={this.props.handleLngChange} />
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Button type="primary" onClick={this.props.handleAddDecimalWaypoint}>Add Waypoint Marker</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

class DMSWaypointMarker extends Component {
    render() {
        return (
            <div>
                <Row type="flex">
                    {/* Latitude Input Group */}
                    <Input.Group>
                        <Col span={24}>
                            <h3>Latitude</h3>
                            <Input addonBefore="Degrees" value={this.props.dms_latitude_degrees} defaultValue={0}
                                   onChange={this.props.handleLatitudeDegreesChange} />
                            <Input addonBefore="Minutes" value={this.props.dms_latitude_minutes} defaultValue={0}
                                   onChange={this.props.handleLatitudeMinutesChange} />
                            <Input addonBefore="Seconds" value={this.props.dms_latitude_seconds} defaultValue={0}
                                   onChange={this.props.handleLatitudeSecondsChange} />
                            <Select defaultValue="north" style={{ width: 120 }} value={this.props.dms_latitude_direction}
                                    onChange={this.props.handleLatitudeDirectionChange}>
                                <Option value="north">North</Option>
                                <Option value="south">South</Option>
                                <Option value="east">East</Option>
                                <Option value="west">West</Option>
                            </Select>
                        </Col>
                    </Input.Group>
                </Row>
                <Row>
                    {/* Longitude Input Group */}
                    <Input.Group>
                        <Col span={24}>
                            <h3>Longitude</h3>
                            <Input addonBefore="Degrees" value={this.props.dms_longitude_degrees} defaultValue={0}
                                   onChange={this.props.handleLongitudeDegreesChange} />
                            <Input addonBefore="Minutes" value={this.props.dms_longitude_minutes} defaultValue={0}
                                   onChange={this.props.handleLongitudeMinutesChange} />
                            <Input addonBefore="Seconds" value={this.props.dms_longitude_seconds} defaultValue={0}
                                   onChange={this.props.handleLongitudeSecondsChange} />
                            <Select defaultValue="north" style={{ width: 120 }} value={this.props.dms_longitude_direction}
                                    onChange={this.props.handleLongitudeDirectionChange}>
                                <Option value="north">North</Option>
                                <Option value="south">South</Option>
                                <Option value="east">East</Option>
                                <Option value="west">West</Option>
                            </Select>

                        </Col>
                    </Input.Group>
                </Row>
                <Row>
                    <Col span={6}>
                        <Button type="primary" onClick={this.props.handleDmsAddWaypoint}>Add Waypoint Marker</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default class Waypoints extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomLevel: 17,
            // waypoint_locations: [],
            // waypoint_markers: [],

            // desired marker
            target_position: {latitude: 0, longitude: 0},
            target_heading: 0,
            target_marker: null,

            // homebase marker
            homebase_marker: null,

            // rover marker
            rover_position: {latitude: 0, longitude: 0},
            rover_marker: null,
            waypoint_table_data: [],

            // decimal waypoints
            decimal_lat: 0,
            decimal_lng: 0,
            // dms waypoints
            dms_latitude_degrees: 0,
            dms_latitude_minutes: 0,
            dms_latitude_seconds: 0,
            dms_longitude_degrees: 0,
            dms_longitude_minutes: 0,
            dms_longitude_seconds: 0,

            // dms direction
            dms_longitude_direction: 'north',
            dms_latitude_direction: 'north'
        };

        this.socketClient = io.connect(rover_settings.waypoint_server_ip);

        // to be used as a custom icon for the rover
        this.roverIcon = L.icon({
            iconUrl: require('./rover-marker-icon.png'),
            iconRetinaUrl: require('./rover-marker-icon-2x.png'),
            shadowUrl: require('./marker-shadow.png'),
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        });

        // to be used as a custom icon for the homebase
        this.homebaseIcon = L.icon({
            iconUrl: require('./homebase-marker-icon.png'),
            iconRetinaUrl: require('./homebase-marker-icon-2x.png'),
            shadowUrl: require('./marker-shadow.png'),
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        });
    }

    handleMapZoom = (e) => {
        let { _zoom : zoomLevel } = e.target;

        this.setState({zoomLevel: zoomLevel});
    };

    /**
     * Generates a marker for the map with a popup of the location
     * @param lat {Number} - latitude number for marker
     * @param lng {Number} - longitude number for marker
     * @param customIcon {L.Icon} - Specified Icon to use in place of the default one
     * @return {JSX} - Returns JSX for Marker & Popup
     */
    generateMarker = (lat, lng, customIcon = (new L.Icon.Default)) => {
        return (
            <Marker key={`${lat}-${lng}`} position={new L.LatLng(lat, lng)} icon={customIcon}>
                <Popup >
                    <div>
                        <div>Lat: {lat}</div>
                        <div>Lng: {lng}</div>
                    </div>
                </Popup>
            </Marker>
        );
    };

    componentDidMount() {
        // load localStorage waypoint_locations if they exist
        // let waypoint_locations = JSON.parse(localStorage.getItem("waypoint_locations"));
        //
        // if (waypoint_locations) {
        //     let generated_markers;
        //
        //     for (let location of waypoint_locations) {
        //         let lat = parseFloat(location[0]);
        //         let lng = parseFloat(location[1]);
        //         generated_markers.push(this.generateMarker(lat, lng));
        //     }
        //
        //     this.setState({waypoint_markers: generated_markers, waypoint_locations: waypoint_locations});
        // }

        // handle when the rover's location is sent to the UI from the raspi server
        this.socketClient.on('rover location', (gps_packet) => {
            // console.log("rover's location:");
            // console.log(gps_packet);
            let { latitude, longitude } = gps_packet;

            let new_rover_marker = this.generateMarker(latitude, longitude, this.roverIcon);
            // console.log(gps_packet);
            this.setState({
                rover_marker: new_rover_marker,
                rover_position: gps_packet
            });

            let target_heading = geolib.getBearing(
                gps_packet,
                this.state.target_position
            );

            this.setState({
                target_heading: target_heading
            });
        });

        // heading value for IMU
        this.socketClient.on('heading', (heading_value) => {
            this.setState({current_heading: heading_value});
        });


        // this.socketClient.on('successful autonomy', () => {
        //     Modal.success({
        //         title: 'Successful Autonomy Misssion',
        //         content: 'Rover has finished its mission!'
        //     })
        // });
    }

    // handleSaveWaypoint = () => {
    //     // in here we send a socket message to server to save the waypoint which the server tells the rover
    //     // we receive back an obj {lat: 0, lng: 10}
    //
    //     /*
    //      * Example Data coming back from server
    //      {
    //      height: "38.7941",
    //      latitude: "33.881812031",
    //      longitude: "-117.882702717",
    //      q:"5",
    //      time:"02:31:27.400"
    //      }
    //      */
    //
    //     this.socketClient.emit('save waypoint', (gps_packet) => {
    //         console.log(gps_packet);
    //         let { latitude, longitude } = (gps_packet);
    //         console.log(latitude, longitude);
    //
    //         // generate new waypoint marker and save
    //         const new_waypoint_marker = this.generateMarker(latitude, longitude);
    //         const waypoint_markers = this.state.waypoint_markers;
    //         waypoint_markers.push(new_waypoint_marker);
    //         this.setState({waypoint_markers});
    //
    //         // then save waypoint location to local storage just in case someone accidentally refreshes
    //         // this.save_ls_waypoint_location(latitude, longitude);
    //
    //         message.info("Average Waypoint Saved!");
    //
    //         // handle adding to the waypoint table
    //         const waypoint_table_data = this.state.waypoint_table_data;
    //         waypoint_table_data.push({
    //             latitude: latitude,
    //             longitude:  longitude,
    //             key: waypoint_table_data.length + 1
    //         });
    //         this.setState({waypoint_table_data});
    //     });
    // };

    /**
     * Helper method to save the ls waypoints
     * @param {Number} lat
     * @param {Number} lng
     */
    // save_ls_waypoint_location = (lat, lng) => {
    //     const waypoint_locations = this.state.waypoint_locations;
    //     waypoint_locations.push([lat, lng]);
    //     this.setState({waypoint_locations});
    //     localStorage.setItem("waypoint_locations", JSON.stringify(waypoint_locations));
    // };
    //
    // handleDeleteRecentWaypoint = () => {
    //     const waypoint_markers = this.state.waypoint_markers;
    //     const waypoint_locations = this.state.waypoint_locations;
    //     const waypoint_table_data = this.state.waypoint_table_data;
    //
    //     // only save the updated waypoints if its valid
    //     // pop will return either a valid array or Undefined
    //     if (waypoint_markers.pop() && waypoint_locations.pop() && waypoint_table_data.pop()) {
    //         this.setState({waypoint_markers, waypoint_locations, waypoint_table_data});
    //
    //         this.socketClient.emit('delete recent waypoint');
    //
    //         // overwrite the localStorage locations to the recently popped waypoint_locations
    //         // localStorage.setItem("waypoint_locations", JSON.stringify(waypoint_locations));
    //     }
    // };

    // handleDeleteAllWaypoints = () => {
    //     let confirmation = confirm("Delete all waypoints?");
    //
    //     if (confirmation) {
    //         this.socketClient.emit('delete all waypoints');
    //         this.setState({waypoint_markers: [], waypoint_locations: [], waypoint_table_data: []});
    //         // localStorage.removeItem("waypoint_locations");
    //     }
    // };

    // handleSaveToFile = () => {
    //     let confirmation = confirm("Save to file?");
    //     if (confirmation) {
    //         this.socketClient.emit('save to file', function (err) {
    //             if(err) {
    //                 message.error("There was an error writing to file. Check console for full error message.");
    //                 console.error(err);
    //                 return;
    //             }
    //
    //             message.success("File saved correctly to file on raspi!");
    //         });
    //     }
    // };

    componentWillUnmount() {
        this.socketClient.disconnect();
    }

    /* functions to handle adding waypoint via decimal */
    handleDecimalLatChange = ({target}) => {
        this.setState({decimal_lat: target.value});

    };

    handleDecimalLngChange = ({target}) => {
        this.setState({decimal_lng: target.value});
    };

    handleDecimalAddWaypoint = () => {
        // updating target position
        const target_position = this.state.target_position;
        target_position.latitude = this.state.decimal_lat;
        target_position.longitude = this.state.decimal_lng;

        // regenerate and update target marker
        let new_target_marker = this.generateMarker(
            parseFloat(this.state.decimal_lat),
            parseFloat(this.state.decimal_lng)
        );

        // finally add location to the table
        // we only have 1 latlng to add to the table
        const waypoint_table_data = this.state.waypoint_table_data;
        waypoint_table_data[0] = {
            latitude: this.state.decimal_lat,
            longitude: this.state.decimal_lng,
            key: 1
        };

        this.setState({
            target_position,
            waypoint_table_data,
            target_marker: new_target_marker
        });
    };

    /* functions to handle adding waypoint via DMS */
    // Latutude DMS Handlers
    handleLatitudeDegreesChange = ({target}) => {
        this.setState({dms_latitude_degrees: target.value});
    };

    handleLatitudeMinutesChange = ({target}) => {
        this.setState({dms_latitude_minutes: target.value});
    };
    handleLatitudeSecondsChange = ({target}) => {
        this.setState({dms_latitude_seconds: target.value});
    };

    handleLatitudeDirectionChange = (value) => {
        this.setState({dms_latitude_direction: value});
    };

    // Longitude DMS Handlers
    handleLongitudeDegreesChange = ({target}) => {
        this.setState({dms_longitude_degrees: target.value});
    };
    handleLongitudeMinutesChange = ({target}) => {
        this.setState({dms_longitude_minutes: target.value});
    };

    handleLongitudeSecondsChange = ({target}) => {
        this.setState({dms_longitude_seconds: target.value});
    };

    handleLongitudeDirectionChange = (value) => {
        this.setState({dms_longitude_direction: value});
    };

    handleDmsAddWaypoint = () => {
        // calculating the decimal format for both lat and lng
        let calculated_latitude_decimial,
            calculated_latitude_minutes = Math.abs(parseFloat(this.state.dms_latitude_minutes)) / 60,
            calculated_latitude_seconds = Math.abs(parseFloat(this.state.dms_latitude_seconds)) / 3600;

        let calculated_longitude_decimial,
            calculated_longitude_minutes = Math.abs(parseFloat(this.state.dms_longitude_minutes)) / 60,
            calculated_longitude_seconds = Math.abs(parseFloat(this.state.dms_longitude_seconds)) / 3600;

        calculated_latitude_decimial = Math.abs(parseFloat(this.state.dms_latitude_degrees)) + calculated_latitude_minutes + calculated_latitude_seconds;
        calculated_longitude_decimial = Math.abs(parseFloat(this.state.dms_longitude_degrees)) + calculated_longitude_minutes + calculated_longitude_seconds;

        // finally apply negative depending on West or East
        switch (this.state.dms_latitude_direction) {
            case 'south':
            case 'west':
                calculated_latitude_decimial *= -1;
        }

        switch (this.state.dms_longitude_direction) {
            case 'south':
            case 'west':
                calculated_longitude_decimial *= -1;
        }


        console.info(`Calculated Latitude: ${calculated_latitude_decimial}`);
        console.info(`Calculated Longitude: ${calculated_longitude_decimial}`);

        // updating target position
        const target_position = this.state.target_position;
        target_position.latitude = calculated_latitude_decimial;
        target_position.longitude = calculated_longitude_decimial;

        // regenerate and update target marker
        let new_target_marker = this.generateMarker(
            calculated_latitude_decimial,
            calculated_longitude_decimial
        );

        // finally add location to the table
        // we only have 1 latlng to add to the table
        const waypoint_table_data = this.state.waypoint_table_data;
        waypoint_table_data[0] = {
            latitude: calculated_latitude_decimial,
            longitude: calculated_longitude_decimial,
            key: 1
        };

        this.setState({
            target_position,
            waypoint_table_data,
            target_marker: new_target_marker
        });
    };

    handleAddHomebaseMarker = () => {
        let homebase_marker = this.generateMarker(
            this.state.rover_position.latitude,
            this.state.rover_position.longitude,
            this.homebaseIcon
        );

        this.setState({
            homebase_marker: homebase_marker
        })
    };

    render() {
        // starting position of map on load
        const position = [
            38.371422690,
            -110.704306553
        ];

        // testing rover marker
        // let new_rover_marker = this.generateMarker(33.88255522931054, -117.88273157819734, this.roverIcon);

        const columns = [{
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        }, {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        }, {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        }];

        return(
            <BaseModuleTemplate moduleName="Waypoints" className="waypoints">
                <Row className="map-row">
                    <Col span={24}>
                        <Map ref={(map) => {this.map = map}} id="map" center={position} zoom={this.state.zoomLevel} maxZoom={20}
                             onZoom={this.handleMapZoom}
                        >
                            <TileLayer
                                url='http://192.168.1.124:8080/styles/osm-bright/rendered/{z}/{x}/{y}.png'
                            />
                            <ZoomDisplay/>
                            {this.state.rover_marker}
                            {this.state.target_marker}
                            {this.state.homebase_marker}
                        </Map>
                    </Col>
                </Row>

                {/* Current Rover Position */}
                <Row>
                    <Card title="Current Rover Position">
                        <Row type="flex" gutter={50}>
                            <Col span={6}>
                                <Input addonBefore="latitude" value={this.state.rover_position.latitude}/>
                            </Col>
                            <Col span={6}>
                                <Input addonBefore="longitude" value={this.state.rover_position.longitude}/>
                            </Col>
                            <Col span={6}>
                                <Button onClick={this.handleAddHomebaseMarker} type="primary">Add Homebase Marker</Button>
                            </Col>
                        </Row>
                    </Card>
                </Row>

                {/* Current Imu Heading */}
                <Row>
                    <Card title="Current IMU Heading">
                        <Row type="flex" gutter={50}>
                            <Col span={6}>
                                <Input addonBefore="current heading" value={this.state.current_heading}/>
                            </Col>
                            <Col span={6}>
                                <Input addonBefore="target heading" value={this.state.target_heading}/>
                            </Col>
                        </Row>
                    </Card>
                </Row>

                {/* Add waypoints manually & table*/}
                <Row>
                    <Col span={12}>
                        <Tabs>
                            <Tabs.TabPane tab="Decimal Waypoint" key="1">
                                <DecimalWaypointMarker
                                    decimal_lng={this.state.decimal_lng}
                                    decimal_lat={this.state.decimal_lat}
                                    handleAddDecimalWaypoint={this.handleDecimalAddWaypoint}
                                    handleLatChange={this.handleDecimalLatChange}
                                    handleLngChange={this.handleDecimalLngChange}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Degrees-Minutes-Seconds Waypoint" key="2">
                                <DMSWaypointMarker
                                    dms_latitude_degrees={this.state.dms_latitude_degrees}
                                    dms_latitude_minutes={this.state.dms_latitude_minutes}
                                    dms_latitude_seconds={this.state.dms_latitude_seconds}
                                    dms_longitude_degrees={this.state.dms_longitude_degrees}
                                    dms_longitude_minutes={this.state.dms_longitude_minutes}
                                    dms_longitude_seconds={this.state.dms_longitude_seconds}
                                    dms_latitude_direction={this.state.dms_latitude_direction}
                                    dms_longitude_direction={this.state.dms_longitude_direction}
                                    handleDmsAddWaypoint={this.handleDmsAddWaypoint}
                                    handleLatitudeDegreesChange={this.handleLatitudeDegreesChange}
                                    handleLatitudeMinutesChange={this.handleLatitudeMinutesChange}
                                    handleLatitudeSecondsChange={this.handleLatitudeSecondsChange}
                                    handleLongitudeDegreesChange={this.handleLongitudeDegreesChange}
                                    handleLongitudeMinutesChange={this.handleLongitudeMinutesChange}
                                    handleLongitudeSecondsChange={this.handleLongitudeSecondsChange}
                                    handleLatitudeDirectionChange={this.handleLatitudeDirectionChange}
                                    handleLongitudeDirectionChange={this.handleLongitudeDirectionChange}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>

                    <Col span={12}>
                        <Table columns={columns} dataSource={this.state.waypoint_table_data}/>
                    </Col>
                </Row>

                {/* Save Waypoint Options */}
                {/*<Row type="flex">*/}
                {/*<Col md={4}>*/}
                {/*<Button type="primary" onClick={this.handleSaveWaypoint}>Save Waypoint</Button>*/}
                {/*</Col>*/}
                {/*<Col md={4}>*/}
                {/*<Button type="primary" onClick={this.handleSaveToFile}>Save to File</Button>*/}
                {/*</Col>*/}
                {/*<Col md={6}>*/}
                {/*<Button type="danger" onClick={this.handleDeleteRecentWaypoint}>Delete Recently Saved Waypoint</Button>*/}
                {/*</Col>*/}
                {/*<Col md={4}>*/}
                {/*<Button type="danger" onClick={this.handleDeleteAllWaypoints}>Delete All Waypoints</Button>*/}
                {/*</Col>*/}
                {/*</Row>*/}

            </BaseModuleTemplate>
        );
    }
}
