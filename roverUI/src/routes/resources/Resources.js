import React, { Component } from 'react';
import DummyModule1 from './modules/DummyModule1';
import DummyModule2 from './modules/DummyModule2';

class Resources extends Component {
    render() {
        return (
            <div>
                <DummyModule1/>
                <DummyModule2/>
            </div>
        );
    }
}

// exporting all dependent modules and itself
export default { Resources, DummyModule1, DummyModule2 };