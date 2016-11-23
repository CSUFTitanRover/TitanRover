import React, { Component } from 'react';
import QueryData from './modules/QueryData';

class Resources extends Component {
    render() {
        return (
            <div>
                <QueryData/>
            </div>
        );
    }
}

// exporting all dependent modules and itself
export default { Resources, QueryData };