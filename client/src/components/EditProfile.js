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
      selectedFile: null,
      redirect: false,
      updateUserError: null
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
    post(backend_url+'/users/profile-details', {username: this.state.username, firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password}).then(response => {
      if(response.status === 200){
        this.setState({
          redirect: true,
          updateUserError: null
        });
      }
      else{
        this.setState({updateUserError: 'Update user failed'});
      }
    }).catch(error => {this.setState({registerError: 'Update user failed'})});
  }
  renderRedirect = () => {
    let prevRoute = this.props.location.state.prevRoute
    if(this.state.redirect && prevRoute){
      return <Redirect to={prevRoute} />
    }
  }
  fileSelectedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
  }
  fileUploadHandler = () => {
    const formData = new FormData();
    formData.append('profilePicture',this.state.selectedFile)
    post(backend_url+'/users/profile-picture', formData).then(response => {
    }).catch(error => {this.setState({loginError: 'File upload error'})});
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
            <div className="editprofile-upload">
              <img className="editprofile-pic" src={this.state.profilePicture} alt="profile" />
              <input type="file" onChange={this.fileSelectedHandler}/>
              <button onClick={this.fileUploadHandler}>Upload</button>
            </div>
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
