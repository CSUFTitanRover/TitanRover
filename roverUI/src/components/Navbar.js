import React, { Component } from 'react';
import './Navbar.css';
import { Link } from 'react-router';

// wrapper class for Links
class NavLink extends Component {
    render () {
        return <Link {...this.props} activeClassName="active"/>
    }
}

class Navbar extends Component {
    render() {
        return (
            <header id="nav-header">
                <div className="brand">
                    <h1>Titan Rover</h1>
                </div>
                <nav>
                    <ul>
                        <li className="folder">
                            <span><NavLink to="/" onlyActiveOnIndex={true}>Overview</NavLink></span>
                            <ul>
                                <li><span><NavLink to="/module1">Module Name #1</NavLink></span></li>
                                <li><span><NavLink to="/module2">Module Name #2</NavLink></span></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar;