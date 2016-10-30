import React, { Component } from 'react';
import './Navbar.css';
import { Link } from 'react-router';

// wrapper class for Links
class NavLink extends Component {
    render () {
        let span_file_line = (this.props.onlyActiveOnIndex === true) ? null : <span className="file-line"></span>;
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
                    <ul className="folder">
                        <li>
                            <NavLink to="/" onlyActiveOnIndex={true} text="Overview" />
                            <ul className="subfolder">
                                <li><NavLink to="/chart1" text="Chart #1" /></li>
                                <li><NavLink to="/module2" text="Module Name #2" /></li>
                                <li><NavLink to="/chart2" text="Chart #2" /></li>
                                <li><NavLink to="/chart3" text="Chart #3" /></li>
                                <li><NavLink to="/cameras" text="Camera Feeds" /></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar;