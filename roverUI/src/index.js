import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import Modules from './components/Modules';

import {Router, IndexRoute, Route, browserHistory} from 'react-router';

let routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Modules.Overview} />
            <Route path="overview" component={Modules.Overview} />
            <Route path="module1" component={Modules.Module1} />
            <Route path="module2" component={Modules.Module2} />
            <Route path="*" component={Modules.FourOhFour} />
        </Route>
    </Router>
);

ReactDOM.render(
  routes,
  document.getElementById('react-app')
);
