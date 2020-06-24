import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class CreateLeaguePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profilePicture: null,
      username: null,
      todaysDate: new Date(),
      render: false
    }
  }
  componentDidMount(){
    get(backend_url+'/users/profile-details').then(response => {
      this.setState({
        username: response.data.username
      });
    }).catch(error => {
      this.setState({
        username: null
      });
    });
    get(backend_url+'/users/profile-picture').then(response => {
      this.setState({profilePicture: response.config.url});
    }).catch(error => {
      this.setState({profilePicture: null});
    });
    this.setState({render: true});
  }
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }
  render(){
    const purpleStyle = {color: '#7702fa', borderColor: '#7702fa'}
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="home-container">
          <Header profilePicture={this.state.profilePicture} username={this.state.username} />
          <h2 style={purpleStyle}>create new league</h2>
          <div style={{paddingLeft: '1em'}}>
            <TextField
              style={purpleStyle}
              id="standard-full-width"
              label="budget"
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              id="date"
              label="set start date"
              type="date"
              variant="outlined"
              defaultValue={this.formatDate(this.state.todaysDate)}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              id="date"
              label="set end date"
              type="date"
              variant="outlined"
              defaultValue={this.formatDate(this.state.todaysDate)}
            />
          </div>
          <div style={{paddingLeft: '1em'}}>
            <h3 style={purpleStyle}><MailOutlineIcon style={{position: 'absolute'}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              invite players
            </h3>
          </div>
        </div>
      </div>
    );
  }


}
export default CreateLeaguePage
