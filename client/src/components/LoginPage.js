import React from 'react';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import '../stylesheets/App.css';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';


const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;


class LoginPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: null,
      password: null,
      loginError: null,
      redirect: false
    }
  }
  handleUsername = (event) => {
    this.setState({username: event.target.value});
  }
  handlePassword = (event) => {
    this.setState({password: event.target.value});
  }
  onLogin = () => {
    post(backend_url+'/users/login', {username: this.state.username, password: this.state.password}).then(response => {
      if(response.status === 200){
        this.setState({
          redirect: true,
          loginError: null
        });
      }
      else{
        this.setState({loginError: 'incorrect login'});
      }
    }).catch(error => {this.setState({loginError: 'incorrect login'})});
  }
  renderRedirect = () => {
    if(this.state.redirect){
      return <Redirect to="/home" />
    }
  }
  render(){
    return(
      <div className="App">
        <div className="side-login">
        </div>
        <div className="login-container">
          <div className="login-form">
            <h1 className="text-color">Fantasy Trading</h1>
            <form>
              <TextField onChange={this.handleUsername} id="standard-full-width" label="username" />
              <br></br>
              <TextField onChange={this.handlePassword} id="standard-password-input" label="password" type="password"/>
            </form>
            {this.state.loginError==null ? null : <text style={{color: 'red'}}>{this.state.loginError}</text>}
          </div>
          <br></br>
          <br></br>
          <br></br>
          {this.renderRedirect()}
          <button onClick={this.onLogin} className="login-button">login</button>
        </div>
      </div>
    );
  }
}
export default LoginPage;
