import React, { Component } from 'react';
import Navbar from './components/Navbar';
import MET from './components/modules_dir/MissionElapsedTime';
import './App.css';
import './c3.min.css';
import 'd3';

class App extends Component {
    render() {
        return (
            <div id="root">
                <Navbar/>
                <div id="main-content">
                    <MET/>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;
