import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Redirect } from 'react-router-dom';
import LeaguesPreview from './LeaguesPreview.js';
import Header from './Header.js';
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profilePicture: null,
      username: null,
      leagues: [],
      leagueInfo: {},
      render: false
    }
  }
  componentDidMount(){
    get(backend_url+'/users/profile-details').then(response => {
      this.setState({
        username: response.data.username
      });
    }).catch(error => {
      this.setState({
        username: null
      });
    });
    get(backend_url+'/users/profile-picture').then(response => {
      this.setState({profilePicture: response.config.url});
    }).catch(error => {
      this.setState({profilePicture: null});
    });
    get(backend_url+'/users/leagues').then(response => {
      var resArr = [];
      var info = this.state.leagueInfo;
      for(let i=0; i<response.data.length; i++){
        let name = response.data[i].name;
        get(backend_url+'/leagues/list/'+name).then(res => {
          let endDate = Date.parse(res.data.endDate)
          let currentDate = Date.now();
          let daysRemaining = Math.round((endDate-currentDate)/86400000);
          info[name] = daysRemaining;
        });
        resArr.push(name);
      }
      this.setState({
        leagues: resArr,
        leagueInfo: info
      });
    }).catch(error => {console.error(error)});
    this.setState({render: true});
  }

  render(){
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="home-container">
          <Header profilePicture={this.state.profilePicture} username={this.state.username} />
          <div className="leagues-container">
            <LeaguesPreview leagues={this.state.leagues} leagueInfo={this.state.leagueInfo} />
          </div>
        </div>
      </div>
    );
  }
}


export default HomePage;
