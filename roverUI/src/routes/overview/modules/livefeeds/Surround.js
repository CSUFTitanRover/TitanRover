import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import {Tabs, Panel} from 'react-tabtab';
import 'react-tabtab/public/stylesheets/folder.css';


class Surround extends Component {
  constructor(props) {
  super(props);
  }
  render() {
      return (
          <BaseModuleTemplate moduleName="360 Degree View">
            <Tabs activeKey={0} style="tabtab__folder__">
            <Panel title="Stream 1">
              <div>
                <img src="http://<IP ADDRESS>/video.mjpg" width="720" height="600"/>
                <img src="http://<IP ADDRESS>/video.mjpg" width="720" height="600"/>
              </div>
            </Panel>
            <Panel title="Stream 2">
              <div>
                <img src="http://<IP ADDRESS>/video.mjpg" width="720" height="600"/>
                <img src="http://<IP ADDRESS>/video.mjpg" width="720" height="600"/>
              </div>
            </Panel>
            <Panel title="Stream 3">
              <div>
                <img src="http://<IP ADDRESS>/video.mjpg" width="720" height="600"/>
                <img src="http://<IP ADDRESS>/video.mjpg" width="720" height="600"/>
              </div>
            </Panel>
          </Tabs>
          </BaseModuleTemplate>
        );
    }
}

export default Surround;
