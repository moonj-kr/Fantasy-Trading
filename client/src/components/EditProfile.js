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
      redirect: false
    }
  }
  renderRedirect = () => {
    let prevRoute = this.props.location.state.prevRoute
    if(this.state.redirect && prevRoute){
      return <Redirect to={prevRoute} />
    }
  }
  onSaveChanges = () => {
    this.setState({redirect: true})
  }
  render(){
    return(
      <div className="App">
        <div className="side-login">
        </div>
        <div className="login-container">
          EditProfile
          <button onClick={this.onSaveChanges} className="login-button">Save Changes</button>
        </div>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default EditProfile;
