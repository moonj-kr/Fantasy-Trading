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
      redirectLogin: false,
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
              <MenuItem style={dropdownMenuStyle}>edit profile</MenuItem>
              <MenuItem onClick={this.logout} style={dropdownMenuStyle}>logout</MenuItem>
            </MenuList>
            : null
          }
        </div>
        <div className="logo-container">
          <img className="logo" src={require("../images/smalllogo.png")} />
        </div>
        {this.renderRedirect()}
    </div>
    );
  }
}


export default Header;
