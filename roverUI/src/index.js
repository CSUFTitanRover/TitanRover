import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Modules from './routes/ModuleList-package';
import {Router, IndexRoute, Route, browserHistory} from 'react-router';

let routes = (
    <Router history={browserHistory} >
        <Route path="/" component={App}>

            <IndexRoute component={Modules.Overview.Overview} />
            <Route path="chart1" component={Modules.Overview.Chart1} />
            <Route path="chart2" component={Modules.Overview.Chart2} />
            <Route path="livefeeds" component={Modules.Overview.LiveFeeds}>
                <Route path="/frontcamera" component={Modules.Overview.FrontCamera} />
                <Route path="/rearcamera" component={Modules.Overview.RearCamera} />
            </Route>

            <Route path="resources" component={Modules.Resources.Resources} />
            <Route path="querydata" component={Modules.Resources.QueryData} />
            <Route path="*" component={Modules.FourOhFour} />
        </Route>
    </Router>
);

ReactDOM.render(
  routes,
  document.getElementById("react-app")
);

