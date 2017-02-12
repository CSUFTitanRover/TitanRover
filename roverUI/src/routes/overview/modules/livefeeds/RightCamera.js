import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import {Tabs, Panel} from 'react-tabtab';
import 'react-tabtab/public/stylesheets/folder.css';


class RightCamera extends Component {
  constructor(props) {
  super(props);
  }
  render() {
      return (
          <BaseModuleTemplate moduleName="Right Camera - 180 Degree">
            <Tabs activeKey={0} style="tabtab__folder__">
            <Panel title="Stream 1">
              <img src="http://192.168.1.126/video.mjpg" width="1280" height="720"/>
            </Panel>
            <Panel title="Stream 2">
              <img src="http://192.168.1.126/video2.mjpg" width="1280" height="720"/>
            </Panel>
            <Panel title="Stream 3">
              <img src="http://192.168.1.126/video3.mjpg" width="1280" height="720"/>
            </Panel>
          </Tabs>
          </BaseModuleTemplate>
        );
    }
}

export default RightCamera;
