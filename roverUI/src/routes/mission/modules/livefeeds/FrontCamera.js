import React, { Component } from 'react';
import BaseModuleTemplate from '../../../../templates/BaseModuleTemplate';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;


class FrontCamera extends Component {
  render() {
      return (
          <BaseModuleTemplate moduleName="Front Camera" tagColor="green">
              <Tabs defaultActiveKey="1" >
                  <TabPane tab="Stream 1" key="1">
                      <img src="http://192.168.1.102/video.mjpg" width="1280" height="720"/>
                  </TabPane>
                  <TabPane tab="Stream 2" key="2">
                      <img src="http://192.168.1.102/video2.mjpg" width="1280" height="720"/>
                  </TabPane>
                  <TabPane tab="Stream 3" key="3">
                      <img src="http://192.168.1.102/video3.mjpg" width="1280" height="720"/>
                  </TabPane>
              </Tabs>
          </BaseModuleTemplate>
        );
    }
}

export default FrontCamera;
