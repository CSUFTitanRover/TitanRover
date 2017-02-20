import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Modules from './routes/ModuleList-package';
import {Router, IndexRoute, Route, browserHistory} from 'react-router';

let routes = (
    <Router history={browserHistory} >
        <Route path="/" component={App}>

            <IndexRoute component={Modules.Mission.Overview} />
            <Route path="Decagon-5TE" component={Modules.Mission.Decagon5TE} />
            <Route path="DHT-11" component={Modules.Mission.DHT11} />
            <Route path="arm-control" component={Modules.Mission.ArmControl} />
            <Route path="livefeeds" component={Modules.Mission.LiveFeeds}>
                <Route path="/armcamera" component={Modules.Mission.ArmCamera} />
                <Route path="/mastcamera" component={Modules.Mission.MastCamera} />
                <Route path="/leftcamera" component={Modules.Mission.LeftCamera} />
                <Route path="/rightcamera" component={Modules.Mission.RightCamera} />
                <Route path="/surround" component={Modules.Mission.Surround} />
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
