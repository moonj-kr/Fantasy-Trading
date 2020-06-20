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

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profilePicture: null,
      username: null,
      arrowUp: false,
      redirectLogin: false,
      leagues: [],
      leagueInfo: {}
    }
  }
  componentDidMount(){
    get(backend_url+'/users/profile-details').then(response => {
      this.setState({
        username: response.data['username']
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
    console.log(this.state.leagueInfo);
  }
  onExpand = () => {
    if(this.state.arrowUp){
      this.setState({arrowUp: false});
    }
    else{
      this.setState({arrowUp: true});
    }
  }
  renderRedirect = () => {
    if(this.state.redirectLogin){
      return <Redirect to="/" />
    }
  }
  logout = () => {
    get(backend_url+'/users/logout').then(response => {
      this.setState({redirectLogin: true});
    }).catch(error => {console.error(error)})
  }
  render(){
    let arrowIconStyle = {verticalAlign: 'middle', margin: 'auto'}
    let dropdownMenuStyle = {color: '#7702fa'}
    let menuListStyle = {backgroundColor: '#E5E8E8', borderRadius: '1em'}
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="home-container">
          <div className="top-bar">
            <img className="profile-pic" src={this.state.profilePicture} alt="profile-picture" />
            <div style={{paddingLeft: '1em'}}>
              <p style={{color: '#7702fa', marginBlockEnd: 'auto'}}>welcome,</p>
              <h3 onClick={this.onExpand} className="header-text">@{this.state.username}
                {this.state.arrowUp ?
                  <ArrowDropUpIcon style={arrowIconStyle}/>
                  : <ArrowDropDownIcon style={arrowIconStyle}/>
                }
              </h3>
              {this.state.arrowUp ?
                <MenuList style={menuListStyle}>
                  <MenuItem style={dropdownMenuStyle}>edit profile</MenuItem>
                  <MenuItem onClick={this.logout} style={dropdownMenuStyle}>logout</MenuItem>
                </MenuList>
                : null
              }
            </div>
            <div className="logo-container">
              <img className="logo" src={require("../images/smalllogo.png")} />
            </div>
        </div>
        <div className="leagues-container">
          <LeaguesPreview leagues={this.state.leagues} leagueInfo={this.state.leagueInfo} />
        </div>
      </div>
        {this.renderRedirect()}
      </div>
    );
  }
}


export default HomePage;
