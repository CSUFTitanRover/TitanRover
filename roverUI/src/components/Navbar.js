import React, { Component } from 'react';
import './Navbar.css';
import { Link } from 'react-router';

// wrapper class for Links
class NavLink extends Component {
    render () {
        return (
            <Link {...this.props} activeClassName="active">
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
                                <li><NavLink to="/chart1"><span>Chart #1</span></NavLink></li>
                                <li><NavLink to="/module2"><span>Module Name #2</span></NavLink></li>
                                <li><NavLink to="/chart2"><span>Chart #2</span></NavLink></li>
                                <li><NavLink to="/chart3"><span>Chart #3</span></NavLink></li>
                                <li><NavLink to="/cameras"><span>Camera Feeds</span></NavLink></li>
                                <li><NavLink to="/chart1" text="Chart #1" /></li>
                                <li><NavLink to="/module2" text="Module Name #2" /></li>
                                <li><NavLink to="/chart2" text="Chart #2" /></li>
                                <li><NavLink to="/chart3" text="Chart #3" /></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar;
