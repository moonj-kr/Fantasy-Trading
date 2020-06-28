import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;
const ENTER_KEY = 13;
class CreateLeaguePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profilePicture: null,
      username: null,
      todaysDate: new Date(),
      name: null,
      nameError: false,
      budget: null,
      budgetError: false,
      startDate: null,
      startDateError: false,
      endDate: null,
      endDateError: false,
      emails: [],
      addEmail: false,
      render: false,
      emailError: false,
      createError: null,
      openDialog: false
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
  handleName = (event) => {
    this.setState({name: event.target.value})
  }
  handleBudget = (event) => {
    var isnum = /^\d+$/.test(event.target.value);
    if(!isnum){
      this.setState({budgetError: true});
    }
    else{
      if(event.target.value < 1000){
        this.setState({budgetError: true});
      }
      else{
        this.setState({
          budget: event.target.value,
          budgetError: false
        });
      }

    }
  }
  handleStartDate = (event) => {
    const startDate = Date.parse(event.target.value);
    if(startDate < this.state.todaysDate){
      this.setState({startDateError: true});
    }
    else{
      this.setState({
        startDate: event.target.value,
        startDateError: false
      });
    }
  }
  handleEndDate = (event) => {
    const endDate = Date.parse(event.target.value);
    let daysBetween = Math.round((endDate-this.state.todaysDate)/86400000);
    if(endDate <= this.state.todaysDate || daysBetween<10){
      this.setState({endDateError: true});
    }
    else{
      this.setState({
        endDate: event.target.value,
        endDateError: false
      })
    }
  }
  handleEmail = (event) => {
    let emails = this.state.emails;
    if (event.keyCode === ENTER_KEY) {
      const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValid = regex.test(event.target.value);
      if(isValid){
        emails.push(event.target.value)
        this.setState({
          emails: emails,
          addEmail: false,
          emailError: false
        });
      }
      else{
        this.setState({emailError: true});
      }
    }
  }
  handleInvite = () => {
    this.setState({addEmail: true});
  }
  checkForNulls(){
    if(this.state.budget == null){
      this.setState({
        budgetError: true,
        createError: 'please fix errors'
      });
    }
    if(this.state.startDate == null){
      this.setState({startDateError: true, createError: 'please fix errors'})
    }
    if(this.state.endDate == null){
      this.setState({endDateError: true, createError: 'please fix errors'});
    }
    if(this.state.name == null){
      this.setState({nameError: true, createError: 'please fix errors'});
    }
    else {
      return false;
    }
    return true;
  }
  save = () => {
    const errors = this.checkForNulls();
    if(!errors){
      post(backend_url+'/leagues/create', {
        name: this.state.name,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        investmentFunds: this.state.budget
      }).then(response => {
        post(backend_url+'/leagues/sendInvite', {
          emails: this.state.emails,
          invitationKey: response.data.invitationKey
        }).then(res => {
          this.setState({createError: null})
        }).catch(error => {this.setState({createError: 'invites could not be sent'})});
      }).catch(error => {this.setState({createError: 'league name is taken'})});
    }
    this.setState({openDialog: true});
  }

  handleClose = () => {
    this.setState({openDialog: false});
  }
  render(){
    const purpleStyle = {color: '#7702fa', borderColor: '#7702fa', margin: '1em'}
    const dialogStyle = this.state.createError == null ? {backgroundColor: '#95DB7E'} : {backgroundColor: '#EA7E7E'}
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="home-container">
          <Header profilePicture={this.state.profilePicture} username={this.state.username} />
          <h2 style={{color: '#7702fa'}}>create new league</h2>
          <div className="form-container">
            <TextField
              style={purpleStyle}
              id="standard-full-width"
              label="name"
              variant="outlined"
              onChange={this.handleName}
              error={this.state.nameError}
            />
            <TextField
              style={purpleStyle}
              id="standard-full-width"
              label="budget"
              variant="outlined"
              onChange={this.handleBudget}
              error={this.state.budgetError}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              style={purpleStyle}
              id="date"
              label="set start date"
              type="date"
              variant="outlined"
              onChange={this.handleStartDate}
              error={this.state.startDateError}
              defaultValue={this.formatDate(this.state.todaysDate)}
            />
            <TextField
              style={purpleStyle}
              id="date"
              label="set end date"
              type="date"
              variant="outlined"
              onChange={this.handleEndDate}
              error={this.state.endDateError}
              defaultValue={this.formatDate(this.state.todaysDate)}
            />
          </div>
          <div style={{paddingLeft: '1em'}}>
            <h3 style={purpleStyle}><MailOutlineIcon style={{position: 'absolute'}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              invite players
            </h3>
            <div className="email-container">
              {this.state.addEmail ?
                <div className="email-invite">
                  <TextField
                    onKeyDown={this.handleEmail}
                    id="standard-size-normal"
                    label="enter email"
                    error={this.state.emailError}
                  />
                </div> : null
              }
              {
                this.state.emails.map(email => (
                  <div style={{lineHeight: '3em'}} className="email-invite" key={email}>
                    {email}
                  </div>
                ))
              }
              <div onClick={this.handleInvite} style={{lineHeight: '3em', width: '8em'}} className="email-invite">
                + add another
              </div>
            </div>
          </div>
          <button className="save-button" onClick={this.save}>save</button>
          <Dialog
            open={this.state.openDialog}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" style={dialogStyle}>
              {this.state.createError == null?"League created successfully!":this.state.createError}
            </DialogTitle>
          </Dialog>
        </div>
      </div>
    );
  }


}
export default CreateLeaguePage
