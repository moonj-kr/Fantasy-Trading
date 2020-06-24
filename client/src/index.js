import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import HomePage from './components/HomePage.js';
import LoginPage from './components/LoginPage.js';
import CreateLeaguePage from './components/CreateLeaguePage.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/create">
        <CreateLeaguePage />
      </Route>
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
