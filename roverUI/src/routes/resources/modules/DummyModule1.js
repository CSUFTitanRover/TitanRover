import React, { Component } from 'react';
import BaseModuleTemplate from '../../../templates/BaseModuleTemplate';

class DummyModule1 extends Component {
    render() {
        return (
            <BaseModuleTemplate moduleName="Dummy Module 1">
                <p>
                    TIL: Ancient Romans would dye their hair black, because blonde hair was associated with prostitutes or French and German slaves. This trend began declining when Augustus Caesar, who was blonde, became Rome's first emperor.
                </p>
            </BaseModuleTemplate>
        );
    }
}

export default DummyModule1;