import React, { Component } from 'react';
import Navbar from './Navbar';
import MissionElapsedTime from './MissionElapsedTime';
import './App.css';
import 'd3';

class App extends Component {
    render() {
        return (
            <div id="root">
                <Navbar/>
                <div id="main-content">
                    <MissionElapsedTime/>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;
