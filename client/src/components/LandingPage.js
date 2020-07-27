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
            <h3 className="header-text-white" style={{width:"100%", textAlign:"center", fontSize:"0.9em"}}>Where you can fantasize about being rich :)</h3>
          </div>
        </div>
        <div className="bottom-landing">
          <div className="landing-description">
            <div className="landing-description-title">
              <h2 className="header-text" style={{width:"100%", textAlign:"left"}}>Welcome to the world of Fantasy Trading!</h2>
            </div>
            <br></br>
            <div className="landing-description-details">
              <h3 className="header-text" style={{width:"100%", textAlign:"left", fontWeight:"200"}}>Improve your stock trading skills by competing with your friends in a league to see whose portfolio makes the most money. Trade stocks from all exchanges using fake money so that you won’t have to worry about losing your real money. You’ll be able practice and take risks in this sandboxed environment while also getting bragging rights with your friends. To award our most skilled members, you will be able to compete on a global leaderboard as well! Your performance in the leagues will factor into how to rank across all of our users.
              Join today by registering an account and creating your first league! Invite your friends using their emails. Portfolios will be updated every day to reflect the current price of the stocks. You’ll be able to look up stocks, and fictitiously buy/sell shares all in one place.

              Buy low and sell high fantasy traders! Good luck!
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
