import React, { Component } from 'react';
import Navbar from './components/Navbar';
import './App.css';

class App extends Component {
    render() {
        return (
            <div id="root">
                <Navbar/>
                <div id="main-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;
