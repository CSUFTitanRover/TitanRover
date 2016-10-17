import React, { Component } from 'react';
import ModuleLink from './ModuleLink';
import './Navbar.css';

class Navbar extends Component {
    render() {
        return (
            <header id="nav-header">
                <div className="brand">
                    <h1>Titan Rover</h1>
                </div>
                <nav>
                    <ul>
                        <li className="folder"><ModuleLink name="Overview" focusState="true"/>
                            <ul>
                                <li><ModuleLink name="Module Name #1"/></li>
                                <li><ModuleLink name="Module Name #2"/></li>
                                <li><ModuleLink name="Module Name #3"/></li>
                                <li><ModuleLink name="Module Name #4"/></li>
                                <li><ModuleLink name="Live Feed (Front)"/></li>
                                <li><ModuleLink name="Live Feed (Top)"/></li>
                            </ul>
                        </li>
                        <li className="folder"><ModuleLink name="Sensors"/></li>
                        <li className="folder"><ModuleLink name="Resources"/></li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar;