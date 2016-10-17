import React, { Component } from 'react';
import Navbar from './components/Navbar.js';
import MainContent from './components/MainContent';
import './App.css';

class App extends Component {
    render() {
        return (
            <div id="root">
                <Navbar/>
                <MainContent/>
            </div>
        );
    }
}

export default App;
