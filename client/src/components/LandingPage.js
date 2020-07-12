import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Logo from '../images/smalllogo.png';
import { Redirect } from 'react-router-dom';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class LandingPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      redirectRegister: false,
      redirectLogin: false,
    }
  }
  renderRegisterRedirect = () => {
    if(this.state.redirectRegister){
      return <Redirect to="/register" />
    }
  }
  renderLoginRedirect = () => {
    if(this.state.redirectLogin){
      return <Redirect to="/login" />
    }
  }
  onRegister = () => {
    this.setState({redirectRegister: true})
  }
  onLogin = () => {
    this.setState({redirectLogin: true})
  }
  render(){
    return(
      <div className="Landing">
        <div className="top-landing">
          <div className="top-bar-landing">
            <h3 onClick={this.onRegister} className="header-text-white">
              register
            </h3>
            <h3 onClick={this.onLogin} className="header-text-white">
              login
            </h3>
          </div>
          <div className="landing-title">
            <img className="full-logo" src={require("../images/fullwhitelogo.png")} />
            {/*<h1 className="header-text-white" style={{width:"100%", textAlign:"center"}}>Fantasy Trading</h1>*/}
            <h3 className="header-text-white" style={{width:"100%", textAlign:"center", fontSize:"0.9em"}}>insert tag line here</h3>
          </div>
        </div>
        <div className="bottom-landing">
          <div className="landing-description">
            <div className="landing-description-title">
              <h2 className="header-text" style={{width:"100%", textAlign:"left"}}>Insert visuals and introduction of site here</h2>
            </div>
            <br></br>
            <div className="landing-description-details">
              <h3 className="header-text" style={{width:"100%", textAlign:"left", fontWeight:"200"}}>Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </h3>
            </div>
          </div>
          <div className="landing-picture">
            <img className="landing-picture-dimensions" src={require("../images/StockViewWidget01.PNG")} />
          </div>
        </div>
        {this.renderRegisterRedirect()}
        {this.renderLoginRedirect()}
      </div>
    );
  }
}


export default LandingPage;
