import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Button, Row, Col, message, Input, Card } from 'antd';
import io from 'socket.io-client';
import rover_settings from '../../../../../rover_settings.json';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import ZoomDisplay from 'react-leaflet-zoom-display';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Needed in order to provide the correct path to marker images
// https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default class Waypoints extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomLevel: 17,
            waypoint_locations: [],
            waypoint_markers: [],
            rover_position: {latitude: 0, longitude: 0},
            rover_marker: null,
            manual_lat: 0,
            manual_lng: 0
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

    handleMapClick = (e) => {
        let { lat, lng } = e.latlng;
        const waypoint_markers = this.state.waypoint_markers;
        waypoint_markers.push(this.generateMarker(lat, lng));
        this.setState({waypoint_markers});
    };

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
        let waypoint_locations = JSON.parse(localStorage.getItem("waypoint_locations"));

        if (waypoint_locations) {
            let generated_markers;

            for (let location of waypoint_locations) {
                let lat = parseFloat(location[0]);
                let lng = parseFloat(location[1]);
                generated_markers.push(this.generateMarker(lat, lng));
            }

            this.setState({waypoint_markers: generated_markers, waypoint_locations: waypoint_locations});
        }

        // handle when the rover's location is sent to the UI from the raspi server
        this.socketClient.on('rover location', (gps_packet) => {
            console.log("rover's location:");
            console.log(gps_packet);
            let { latitude, longitude } = gps_packet;

            let new_rover_marker = this.generateMarker(latitude, longitude, this.roverIcon);
            this.setState({rover_marker: new_rover_marker, rover_position: gps_packet});
        });

    }

    handleSaveWaypoint = () => {
        // in here we send a socket message to server to save the waypoint which the server tells the rover
        // we receive back an obj {lat: 0, lng: 10}

        /*
         * Example Data coming back from server
             {
                 height: "38.7941",
                 latitude: "33.881812031",
                 longitude: "-117.882702717",
                 q:"5",
                 time:"02:31:27.400"
             }
         */

        this.socketClient.emit('save waypoint', (gps_packet) => {

            console.log(gps_packet);
            let { latitude, longitude } = (gps_packet);
            console.log(latitude, longitude);

            // generate new waypoint marker and save
            const new_waypoint_marker = this.generateMarker(latitude, longitude);
            const waypoint_markers = this.state.waypoint_markers;
            waypoint_markers.push(new_waypoint_marker);
            this.setState({waypoint_markers});

            // then save waypoint location to local storage just in case someone accidentally refreshes
            this.save_ls_waypoint_location(latitude, longitude);

            message.success("Average Waypoint Saved!");
        });
    };

    /**
     * Helper method to save the ls waypoints
     * @param {Number} lat
     * @param {Number} lng
     */
    save_ls_waypoint_location = (lat, lng) => {
        const waypoint_locations = this.state.waypoint_locations;
        waypoint_locations.push([lat, lng]);
        this.setState({waypoint_locations});
        localStorage.setItem("waypoint_locations", JSON.stringify(waypoint_locations));
    };

    handleDeleteRecentWaypoint = () => {
        const waypoint_markers = this.state.waypoint_markers;
        const waypoint_locations = this.state.waypoint_locations;

        // only save the updated waypoints if its valid
        // pop will return either a valid array or Undefined
        if (waypoint_markers.pop() && waypoint_locations.pop()) {
            this.setState({waypoint_markers, waypoint_locations});

            this.socketClient.emit('delete recent waypoint');

            // overwrite the localStorage locations to the recently popped waypoint_locations
            localStorage.setItem("waypoint_locations", JSON.stringify(waypoint_locations));
        }
    };

    handleDeleteAllWaypoints = () => {
        let confirmation = confirm("Delete all waypoints?");

        if (confirmation) {
            this.socketClient.emit('delete all waypoints');
            this.setState({waypoint_markers: [], waypoint_locations: []});
            localStorage.removeItem("waypoint_locations");
        }
    };

    handleSaveToFile = () => {
        let confirmation = confirm("Save to file?");
        if (confirmation) {
            this.socketClient.emit('save to file', function (err) {
                message.error("There was an error writing to file. Check console for full error message.");
                console.log(err);
            });
        }
    };

    componentWillUnmount() {
        this.socketClient.disconnect();
    }

    handleManualLat = ({target}) => {
        this.setState({manual_lat: target.value});

    };

    handleManualLng = ({target}) => {
        this.setState({manual_lng: target.value});
    };

    render() {
        // starting position of map on load
        const position = [33.88255522931054, -117.88273157819734];

        // testing rover marker
        let new_rover_marker = this.generateMarker(33.88255522931054, -117.88273157819734, this.roverIcon);

        return(
            <BaseModuleTemplate moduleName="Waypoints" className="waypoints">
                <Row className="map-row">
                    <Col span={24}>
                        <Map ref={(map) => {this.map = map}} id="map" center={position} zoom={this.state.zoomLevel} maxZoom={20}
                             onZoom={this.handleMapZoom}
                        >
                            <TileLayer
                                url='http://localhost:8080/styles/osm-bright/rendered/{z}/{x}/{y}.png'
                            />
                            <ZoomDisplay/>
                            {new_rover_marker}
                            {/*{this.state.rover_marker}*/}
                            {this.state.waypoint_markers}
                        </Map>
                    </Col>
                </Row>

                <Row>
                    <Card title="Add Waypoint Marker">
                        <Row type="flex" gutter={50}>
                            <Col span={6}>
                                <Input addonBefore="latitude" value={this.state.manual_lat} onChange={this.handleManualLat} />
                            </Col>
                            <Col span={6}>
                                <Input addonBefore="longitude" value={this.state.manual_lng} onChange={this.handleManualLng} />
                            </Col>
                            <Col span={6}>
                                <Button type="primary" onClick={this.handleManualWaypointMarker}>Add Waypoint Marker</Button>
                            </Col>
                        </Row>
                    </Card>
                </Row>

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

                <Row type="flex">
                    <Col md={4}>
                        <Button type="primary" onClick={this.handleSaveWaypoint}>Save Waypoint</Button>
                    </Col>
                    <Col md={4}>
                        <Button type="primary" onClick={this.handleSaveToFile}>Save to File</Button>
                    </Col>
                    <Col md={6}>
                        <Button type="danger" onClick={this.handleDeleteRecentWaypoint}>Delete Recently Saved Waypoint</Button>
                    </Col>
                    <Col md={4}>
                        <Button type="danger" onClick={this.handleDeleteAllWaypoints}>Delete All Waypoints</Button>
                    </Col>
                </Row>

            </BaseModuleTemplate>
        );
    }

    handleManualWaypointMarker = () => {
        const newMarker = this.generateMarker(this.state.manual_lat, this.state.manual_lng);

        const waypoint_markers = this.state.waypoint_markers;
        waypoint_markers.push(newMarker);

        this.setState({waypoint_markers});
    };
}