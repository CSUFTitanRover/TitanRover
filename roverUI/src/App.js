import React, { Component } from 'react';
import MissionElapsedTime from './MissionElapsedTime';
import './App.css';
import '../public/iconfont/iconfont.css';
import 'd3';
import { Layout, LocaleProvider } from  'antd';
const { Sider, Content, Header } = Layout;
import NavMenu from './NavMenu';
import enUS from 'antd/lib/locale-provider/en_US';

/*
    Need to wrap in LocaleProvider to set default language to en_US
 */

class App extends Component {

    render() {
        return (
            <LocaleProvider locale={enUS}>
                <Layout>
                    <Sider collapsible
                           collapsedWidth="115"
                    >
                        <Header><div className="logo">Titan Rover</div></Header>
                        <NavMenu/>
                    </Sider>
                    <Content id="main-content">
                        <Header><MissionElapsedTime/></Header>
                        <Content>
                            {this.props.children}
                        </Content>
                    </Content>
                </Layout>
            </LocaleProvider>
        );
    }
}

export default App;
