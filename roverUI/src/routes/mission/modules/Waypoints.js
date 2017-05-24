import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import { Button } from 'antd';
import io from 'socket.io-client';
import rover_settings from '../../../../rover_settings.json';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import ZoomDisplay from 'react-leaflet-zoom-display';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

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
            lat: 33.88255522931054,
            lng: -117.88273157819734,
            markers: [],
            rover_position: [33.88255522931054, -117.88273157819734],
            rover_marker: null,
            ls_waypoints: []
        };

        this.socketClient = io.connect(rover_settings.waypoint_server_ip);
    }

    handleMapClick = (e) => {
        let { lat, lng } = e.latlng;
        const markers = this.state.markers;
        markers.push(this.generateMarker(lat, lng));
        this.setState({markers});
    };

    handleMapZoom = (e) => {
        let { _zoom : zoomLevel } = e.target;

        this.setState({zoomLevel: zoomLevel});
    };

    generateMarker = (lat, lng) => {
        return (
            <Marker key={`${lat}-${lng}`} position={[lat, lng]}>
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
        this.setState({rover_marker: this.generateRoverMarker(this.state.rover_position)});

        // console.log(this.rover);
        // // Let's fake our moving rover
        // this.interval = setInterval( () => {
        //     const rover_position = this.state.rover_position;
        //     rover_position[0] += 0.000001;
        //     rover_position[1] += 0.000001;
        //     // this.rover.setLatLng(rover_position).update();
        //     this.setState({
        //         rover_position,
        //         rover_marker: this.generateRoverMarker(rover_position)
        //     });
        // }, 10);

        // load localStorage waypoints if they exist
        let ls_waypoints = JSON.parse(localStorage.getItem("waypoints"));

        if (ls_waypoints) {
            let generated_markers;

            for (let waypoint of ls_waypoints) {
                let lat = waypoint[0];
                let lng = waypoint[1];
                generated_markers.push(this.generateMarker(lat, lng));
            }

            this.setState({ls_waypoints: ls_waypoints, markers: generated_markers});
        }

        // const self = this;
        // this.socketClient.on('current waypoint', function(gps_packet) {
        //
        //     console.log(gps_packet);
        //     let { latitude, longitude } = gps_packet;
        //     self.generateMarker(latitude, longitude);
        // });
    }

    generateRoverMarker = (latlng) => {
        let rmStyle = {WebkitFilter: 'sepia(3)', Filter: 'sepia(3)'};
        return (<Marker position={latlng} style={rmStyle} key={`${latlng[0]}-${latlng[1]}`} />);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
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

        const self = this;
        this.socketClient.emit('save waypoint', function(gps_packet) {

            console.log(gps_packet);
            let { latitude, longitude } = (gps_packet);
            console.log(latitude, longitude);
            self.generateMarker(latitude, longitude);
        });
        // const lat = this.state.rover_position[0];
        // const lng = this.state.rover_position[1];
        // const markers = this.state.markers;
        // const ls_waypoints = this.state.ls_waypoints;
        // markers.push(this.generateMarker(lat, lng));
        // this.setState({markers});
        //
        // ls_waypoints.push([lat, lng]);
        // this.saveLsWaypoint(ls_waypoints);
    };

    /**
     * Helper method to save the ls waypoints
     * @param {array} updated_ls_waypoints
     */
    saveLsWaypoint = (updated_ls_waypoints) => {
        this.setState({ls_waypoints: updated_ls_waypoints});
        localStorage.setItem("waypoints", JSON.stringify(updated_ls_waypoints));
    };

    handleDeleteRecentWaypoint = () => {
        const markers = this.state.markers;
        const ls_waypoints = this.state.ls_waypoints;

        // only save the updated waypoints if its valid
        // pop will return either a valid array or Undefined
        if (markers.pop() && ls_waypoints.pop()) {
            this.setState({markers});
            this.saveLsWaypoint(ls_waypoints);
        }
    };

    handleDeleteAllWaypoints = () => {
        this.setState({markers: [], ls_waypoints: []});
        localStorage.removeItem("waypoints");
    };

    render() {
        // starting position of map on load
        const position = [33.88255522931054, -117.88273157819734];

        return(
            <BaseModuleTemplate moduleName="Waypoints">
                <Map ref={(map) => {this.map = map}} id="map" center={position} zoom={this.state.zoomLevel} maxZoom={20}
                     onClick={this.handleMapClick} onZoom={this.handleMapZoom}
                >
                    <TileLayer
                        url='http://localhost:8080/styles/osm-bright/rendered/{z}/{x}/{y}.png'
                    />
                    <ZoomDisplay/>
                    {this.state.rover_marker}
                    {this.state.markers}
                </Map>

                <Button type="primary" onClick={this.handleSaveWaypoint}>Save Waypoint</Button>
                <Button type="danger" onClick={this.handleDeleteRecentWaypoint}>Delete Recently Saved Waypoint</Button>
                <Button type="danger" onClick={this.handleDeleteAllWaypoints}>Delete All Waypoints</Button>
            </BaseModuleTemplate>
        );
    }
}