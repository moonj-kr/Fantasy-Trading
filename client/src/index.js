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
import StockPage from './components/StockPage.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/stock/:leagueid/:symbol" component={StockPage} />
      <Route path="/register/:invitationKey?" component={RegisterPage} />
      <Route path="/login/:invitationKey?" component={LoginPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/editprofile" component={EditProfile} />
      <Route path="/league/:name" component={LeaguePage} />
      <Route path="/create" component={CreateLeaguePage} />
      <Route path="/" component={LandingPage} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
