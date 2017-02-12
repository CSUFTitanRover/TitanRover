import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import {Tabs, Panel} from 'react-tabtab';
import 'react-tabtab/public/stylesheets/folder.css';


class ArmCamera extends Component {
  constructor(props) {
  super(props);
  }
  render() {
      return (
          <BaseModuleTemplate moduleName="Arm Camera">
            <Tabs activeKey={0} style="tabtab__folder__">
            <Panel title="Stream 1">
              <img src="http://<IP ADDRESS>/video.mjpg" width="1280" height="720"/>
            </Panel>
            <Panel title="Stream 2">
              <img src="http://<IP ADDRESS>/video2.mjpg" width="1280" height="720"/>
            </Panel>
            <Panel title="Stream 3">
              <img src="http://<IP ADDRESS>/video3.mjpg" width="1280" height="720"/>
            </Panel>
          </Tabs>
          </BaseModuleTemplate>
        );
    }
}

export default ArmCamera;
