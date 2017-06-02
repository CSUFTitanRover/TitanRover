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
                    <Input.Group compact>
                        <Col span={24}>
                            <Input addonBefore="Degrees" value={this.props.decimal_lat} defaultValue={0}
                                   onChange={this.props.handleLatChange} />
                            <Input addonBefore="Minutes" value={this.props.decimal_lat} defaultValue={0}
                                   onChange={this.props.handleLatChange} />
                            <Input addonBefore="Seconds" value={this.props.decimal_lat} defaultValue={0}
                                   onChange={this.props.handleLatChange} />
                            <Select value={this.props.decimal_lat} onChange={this.props.handleLatChange}
                                    defaultValue="N" placeholder="Select Direction" style={{minWidth: 150}}>
                                <Select.Option value="N">N</Select.Option>
                                <Select.Option value="W">W</Select.Option>
                                <Select.Option value="E">E</Select.Option>
                                <Select.Option value="S">S</Select.Option>
                            </Select>
                        </Col>
                    </Input.Group>
                </Row>
                <Row>
                    <Col span={6}>
                        <Button type="primary" onClick={this.props.handleAddSexaWaypoint}>Add Waypoint Marker</Button>
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

            // rover marker
            rover_position: {latitude: 0, longitude: 0},
            rover_marker: null,
            waypoint_table_data: [],

            // decimal waypoints
            decimal_lat: 0,
            decimal_lng: 0,
            // dms waypoints
            dms_degrees: 0,
            dms_minutes: 0,
            dms_seconds: 0,
        };

        this.socketClient = io.connect(rover_settings.waypoint_server_ip);

        // to be used as a custom icon for the rover
        this.roverIcon = L.icon({
            iconUrl: require('./rover-marker-icon.png'),
            iconRetinaUrl: require('./rover-marker-icon-2x.png'),
            shadowUrl: require('./rover-marker-shadow.png'),
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
            console.log(gps_packet);
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
        this.setState({target_position});

        // regenerate and update target marker
        let new_target_marker = this.generateMarker(this.state.decimal_lat, this.state.decimal_lng);

        // finally add location to the table
        const waypoint_table_data = this.state.waypoint_table_data;
        waypoint_table_data.push({
            latitude: this.state.decimal_lat,
            longitude: this.state.decimal_lng,
            key: this.state.waypoint_table_data.length + 1
        });

        this.setState({
            target_position,
            waypoint_table_data,
            target_marker: new_target_marker
        });
    };

    /* functions to handle adding waypoint via DMS */
    // handleDmsDegreeChange = ({target}) => {
    //     this.setState({dms_degrees: target.value});
    // };
    //
    // handleDmsMinuteChange = ({target}) => {
    //     this.setState({dms_minutes: target.value});
    // };
    // handleDmsSecondChange = ({target}) => {
    //     this.setState({dms_seconds: target.value});
    // };
    //
    // handleDmsAddWaypoint = () => {
    // };

    handleMapClick = ({latlng}) => {
      this.test.push(
          this.generateMarker(latlng.lat, latlng.lng)
      );
    };

    render() {
        // starting position of map on load
        const position = [38.371402909,-110.704230193];

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
                             onZoom={this.handleMapZoom} onClick={this.handleMapClick}
                        >
                            <TileLayer
                                url='http://localhost:8080/styles/osm-bright/rendered/{z}/{x}/{y}.png'
                            />
                            <ZoomDisplay/>
                            {this.state.rover_marker}
                            {this.state.target_marker}
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
                            {/*<Tabs.TabPane tab="Degrees-Minutes-Seconds Waypoint" key="2">*/}
                                {/*<DMSWaypointMarker />*/}
                            {/*</Tabs.TabPane>*/}
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
