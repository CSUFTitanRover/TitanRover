import React, { Component } from 'react';
import './Navbar.css';
import { Link } from 'react-router';

// wrapper class for Links
class NavLink extends Component {
    render () {
        const span_file_line = (this.props.folderroot === true) ? null : <span className="file-line" />;
        return (
            <Link {...this.props} activeClassName="active">
                {span_file_line}
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
                                <li><NavLink to="/chart1" text="Chart #1" /></li>
                                <li><NavLink to="/module2" text="Module Name #2" /></li>
                                <li><NavLink to="/chart2" text="Chart #2" /></li>
                                <li><NavLink to="/chart3" text="Chart #3" /></li>
                                <li><NavLink to="/cameras" text="Camera Feeds" /></li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/resources" folderroot={true} className="folderroot" text="Resources" />
                            <ul className="folderlinks">
                                <li><NavLink to="/dummymodule1" text="Dummy Module 1" /></li>
                                <li><NavLink to="/dummymodule2" text="Dummy Module 2" /></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar;