import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class RegisterPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      username: null,
      email: null,
      password: null,
      registerError: null,
      redirectHome: false
    }
  }
  handleFirstName = (event) => {
    this.setState({firstName: event.target.value});
  }
  handleLastName = (event) => {
    this.setState({lastName: event.target.value});
  }
  handleUsername = (event) => {
    this.setState({username: event.target.value});
  }
  handleEmail = (event) => {
    this.setState({email: event.target.value});
  }
  handlePassword = (event) => {
    this.setState({password: event.target.value});
  }
  onRegister = () => {
    let key = null;
    if(this.props.match.params.invitationKey){
      key = this.props.match.params.invitationKey.split("=")[1];
    }
    post(backend_url+'/users/register', {username: this.state.username, firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password, invitationKey: key}).then(response => {
      if(response.status === 201){
        this.setState({
          redirectHome: true,
          registerError: null
        });
      }
      else{
        this.setState({registerError: 'incorrect register'});
      }
    }).catch(error => {this.setState({registerError: 'incorrect register'})});
  }
  renderHomeRedirect = () => {
    if(this.state.redirectHome){
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
              <TextField onChange={this.handleFirstName} id="standard-full-width" label="firstName" />
              <br></br>
              <TextField onChange={this.handleLastName} id="standard-full-width" label="lastName" />
              <br></br>
              <TextField onChange={this.handleUsername} id="standard-full-width" label="username" />
              <br></br>
              <TextField onChange={this.handleEmail} id="standard-full-width" label="email" />
              <br></br>
              <TextField onChange={this.handlePassword} id="standard-password-input" label="password" type="password"/>
            </form>
            {this.state.registerError==null ? null : <text style={{color: 'red'}}>{this.state.registerError}</text>}
          </div>
          <br></br>
          <br></br>
          <br></br>
          {this.renderHomeRedirect()}
          <button onClick={this.onRegister} className="login-button">CREATE ACCOUNT</button>
        </div>
      </div>
    );
  }
}


export default RegisterPage;
