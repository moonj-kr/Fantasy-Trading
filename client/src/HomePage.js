import React from 'react';
import './stylesheets/App.css';
import './stylesheets/materialui1.css';
import './stylesheets/materialui2.css';
import './stylesheets/App.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
const backend_url = require('./utils/backendUrl.js').backend_url;
const get = require('./utils/requests.js').getRequest;
const post = require('./utils/requests.js').postRequest;

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profilePicture: null,
      username: null
    }
  }
  componentDidMount(){
    get(backend_url+'/users/profile-details').then(response => {
      this.setState({
        username: response.data['username'],
        profilePicture: response.data['profilePicture']
      });
    }).catch(error => {
      this.setState({
        username: null,
        profilePicture: null
      });
    });
  }
  render(){
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="home-container">
          <img className="profile-pic" src={this.state.profilePicture} alt="profile-picture" />
          <div style={{paddingLeft: '1em'}}>
            <p style={{color: '#7702fa'}}>welcome,</p>
            <h3 className="header-text">@{this.state.username} </h3>
          </div>
        </div>
      </div>
    );
  }
}


export default HomePage;
