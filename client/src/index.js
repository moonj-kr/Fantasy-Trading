import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import LandingPage from './components/LandingPage.js';
import RegisterPage from './components/RegisterPage.js';
import LoginPage from './components/LoginPage.js';
import HomePage from './components/HomePage.js';
import EditProfile from './components/EditProfile.js';
import CreateLeaguePage from './components/CreateLeaguePage.js';
import LeaguePage from './components/LeaguePage.js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/register/:invitationKey?" component={RegisterPage} />
      <Route path="/login/:invitationKey?" component={LoginPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/editprofile" component={EditProfile} />
      <Route path="/league/:name">
        <LeaguePage />
      </Route>
      <Route path="/create">
        <CreateLeaguePage />
      </Route>
      <Route path="/">
        <LandingPage />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
