import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Redirect } from 'react-router-dom';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;


class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      arrowUp: false,
      redirectLogout: false,
      redirectEditProfile: false,
      render: false
    }
  }

  onExpand = () => {
    if(this.state.arrowUp){
      this.setState({arrowUp: false});
    }
    else{
      this.setState({arrowUp: true});
    }
  }
  renderLogoutRedirect = () => {
    if(this.state.redirectLogout){
      return <Redirect to="/" />
    }
  }
  renderEditProfileRedirect = () => {
    if(this.state.redirectEditProfile){
      console.log("Header, redirect to EditProfile")
      console.log(this.props.prevRoute)
      return <Redirect to={{
        pathname: "/editprofile",
        state: { prevRoute: this.props.prevRoute, profilePicture: this.props.profilePicture }
        }}
        />
    }
  }
  logout = () => {
    get(backend_url+'/users/logout').then(response => {
      this.setState({redirectLogout: true});
    }).catch(error => {console.error(error)})
  }
  editProfile = () => {
    this.setState({redirectEditProfile: true});
  }
  render(){
    let arrowIconStyle = {verticalAlign: 'middle', margin: 'auto'}
    let dropdownMenuStyle = {color: '#7702fa'}
    let menuListStyle = {backgroundColor: '#E5E8E8', borderRadius: '1em'}
    return(
      <div className="top-bar">
        <img className="profile-pic" src={this.props.profilePicture} alt="profile" />
        <div style={{paddingLeft: '1em'}}>
          <p style={{color: '#7702fa', marginBlockEnd: 'auto'}}>welcome,</p>
          <h3 onClick={this.onExpand} className="header-text">@{this.props.username}
            {this.state.arrowUp ?
              <ArrowDropUpIcon style={arrowIconStyle}/>
              : <ArrowDropDownIcon style={arrowIconStyle}/>
            }
          </h3>
          {this.state.arrowUp ?
            <MenuList style={menuListStyle}>
              <MenuItem onClick={this.editProfile} style={dropdownMenuStyle}>edit profile</MenuItem>
              <MenuItem onClick={this.logout} style={dropdownMenuStyle}>logout</MenuItem>
            </MenuList>
            : null
          }
        </div>
        <div className="logo-container">
          <img className="logo" src={require("../images/smalllogo.png")} alt="logo" />
        </div>
        {this.renderLogoutRedirect()}
        {this.renderEditProfileRedirect()}
    </div>
    );
  }
}


export default Header;
