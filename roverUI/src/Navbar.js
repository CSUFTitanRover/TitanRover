import React, { Component } from 'react';
import './Navbar.css';
import { Link } from 'react-router';

// wrapper class for Links
class NavLink extends Component {
    render () {
        const file_line = (this.props.folderroot === true) ? null : <span className="file-line" />;
        return (
            <Link {...this.props} activeClassName="active">
                {file_line}
                <span className="link-text">
                    {this.props.text}
                </span>
                {this.props.children}
            </Link>
        );
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
                        <li>
                            <NavLink to="/" onlyActiveOnIndex={true} folderroot={true} className="folderroot" text="Overview" />
                            <ul className="folderlinks">
                                <li><NavLink to="/chart1" text="Decagon 5TE Chart" /></li>
                                <li><NavLink to="/chart2" text="DHT 11 Chart" /></li>
                                <li><NavLink to="/livefeeds" text="Live Feeds" /></li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/resources" folderroot={true} className="folderroot" text="Resources" />
                            <ul className="folderlinks">
                                <li><NavLink to="/dummymodule1" text="Query Data" /></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar;