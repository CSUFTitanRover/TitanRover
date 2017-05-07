import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';
import 'leaflet/dist/leaflet.css'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import {OfflineLayer, OfflineProgressControl} from 'offline-leaflet-map';
import { Button } from 'antd';

export default class Waypoints extends Component {
    constructor(props) {
        super(props);

        const offlineOptions = {onReady: this.onReady, storeName:"OfflineMapStore", dbOption:"IndexedDB"};
        this.offlineLayer = new OfflineLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', offlineOptions);

        console.log(this.offlineLayer);
    }

    onReady = () => {
        console.log('Offline Map Ready!')
    };

    render() {
        const mapStyle = {width: 700, height: 500};
        const position = [51.505, -0.09];

        return(
            <BaseModuleTemplate moduleName="Waypoints">
                <Map id="map" center={position} zoom={13}>
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    <Marker position={position}>
                        <Popup>
                            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                        </Popup>
                    </Marker>
                </Map>

                <Button type="primary">Save Current Map Layer</Button>
            </BaseModuleTemplate>
        );
    }
}