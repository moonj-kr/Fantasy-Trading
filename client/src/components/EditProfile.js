import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class EditProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      username: null,
      email: null,
      password: null,
      profilePicture: this.props.location.state.profilePicture,
      redirect: false
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
  onSaveChanges = () => {
    this.setState({redirect: true})
  }
  renderRedirect = () => {
    let prevRoute = this.props.location.state.prevRoute
    if(this.state.redirect && prevRoute){
      return <Redirect to={prevRoute} />
    }
  }
  render(){
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="editprofile-container">
          <div className="top-bar">
            <h1 className="text-color">edit profile</h1>
            <div className="logo-container">
              <img className="logo" src={require("../images/smalllogo.png")} alt="logo" />
            </div>
          </div>
          <div className="editprofile-body">
            <img className="editprofile-pic" src={this.state.profilePicture} alt="profile" />
            <div className="editprofile-form">
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
            </div>
          </div>
          <div className="editprofile-bottom">
            <button onClick={this.onSaveChanges} className="login-button">Save Changes</button>
          </div>
        </div>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default EditProfile;
