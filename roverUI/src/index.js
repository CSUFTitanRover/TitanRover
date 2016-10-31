import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Modules from './components/Modules_List';
import {Router, IndexRoute, Route, browserHistory} from 'react-router';

let routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Modules.Overview} />
            <Route path="chart1" component={Modules.Chart1} />
            <Route path="chart2" component={Modules.Chart2} />
            <Route path="chart3" component={Modules.Chart3} />
            <Route path="module2" component={Modules.Module2} />
            <Route path="cameras" component={Modules.CameraModule} />
            <Route path="resources" component={Modules.Resources} />
            <Route path="dummymodule1" component={Modules.DummyModule1} />
            <Route path="dummymodule2" component={Modules.DummyModule2} />
            <Route path="*" component={Modules.FourOhFour} />
        </Route>
    </Router>
);

ReactDOM.render(
  routes,
  document.getElementById("react-app")
);
