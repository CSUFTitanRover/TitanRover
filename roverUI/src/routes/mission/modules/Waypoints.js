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
        };

        this.socketClient = io.connect(rover_settings.homebase_ip);
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

    onSaveWaypoint = () => {
        // in here we send a socket message to server to save the waypoint which the server tells the rover
        // we receive back an obj {lat: 0, lng: 10}
        // this.socketClient.emit('save waypoint', (waypoint) => {
        //     let { lat, lng } = waypoint;
        //     this.generateMarker(lat, lng);
        // });
        let lat = this.state.rover_position[0];
        let lng = this.state.rover_position[1];
        const markers = this.state.markers;
        markers.push(this.generateMarker(lat, lng));
        this.setState({markers});
    };

    componentDidMount() {
        this.setState({rover_marker: this.generateRoverMarker(this.state.rover_position)});

        console.log(this.rover);
        // Let's fake our moving rover
        this.interval = setInterval( () => {
            const rover_position = this.state.rover_position;
            rover_position[0] += 0.000001;
            rover_position[1] += 0.000001;
            // this.rover.setLatLng(rover_position).update();
            this.setState({
                rover_position,
                rover_marker: this.generateRoverMarker(rover_position)
            });
        }, 10);
    }

    generateRoverMarker = (latlng) => {
        let rmStyle = {WebkitFilter: 'sepia(3)', Filter: 'sepia(3)'};
        return (<Marker position={latlng} style={rmStyle} key={`${latlng[0]}-${latlng[1]}`} />);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {
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

                <Button type="primary" onClick={this.onSaveWaypoint}>Save Waypoint</Button>
            </BaseModuleTemplate>
        );
    }
}