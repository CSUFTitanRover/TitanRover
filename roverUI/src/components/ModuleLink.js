import React, { Component } from 'react';
import './ModuleLink.css';

class ModuleLink extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.focusState === "true" ? {focus: true} : {focus: false};
    }

    /*
    getInitialState()
    {
        if (this.props.focusState) {
            if (this.props.focusState === "true")
                return {focus: true};
        }
        return {focus: false};

        //return {focus: false};
    }
    */

    handleClick()
    {
        // first clear the span tag with focus

        if (this.state.focus == false)
        {
            this.setState({focus: true})
        }

    }

    render()
    {
        var className = this.state.focus === true ? "focus" : null;
        return (
            <span className={className} >
                <a href={this.props.name} onClick={ () => {this.handleClick()}}>
                    {this.props.name}
                </a>
            </span>
        );
    }
}

export default ModuleLink;
