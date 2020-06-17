import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import HomePage from './HomePage.js';
import LoginPage from './LoginPage.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/home">
        <HomePage />
      </Route>
      <Route path="/">
        <LoginPage />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
