import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';

const contentNode = document.getElementById('contents');
ReactDOM.render(
  <Router>
    <App />
  </Router>
  , contentNode);

if (module.hot) {
  module.hot.accept();
}
