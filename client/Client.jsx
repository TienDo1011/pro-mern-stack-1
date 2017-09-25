import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import routes from './src/Routes.jsx';

const contentNode = document.getElementById('contents');
ReactDOM.render(
  <Router history={browserHistory} >
      {routes}
  </Router>
  , contentNode);

if (module.hot) {
  module.hot.accept();
}
