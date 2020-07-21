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
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { Redirect } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';



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
      startDate: this.formatDate(new Date()),
      startDateError: false,
      endDate: this.formatDate(new Date()),
      endDateError: false,
      emails: [],
      addEmail: false,
      render: false,
      emailError: false,
      createError: null,
      openDialog: false,
      redirectLeague: false,
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
    if(this.props.location.state != null){
      let leagueDetails = this.props.location.state.leagueDetails;
      get(backend_url+'/leagues/invites/'+leagueDetails.invitationKey).then(response => {
        let emailsArray = [];
        for(let i=0; i<response.data.length; i++){
          emailsArray.push(response.data[i].email);
        }
        this.setState({
          name: leagueDetails.name,
          startDate: leagueDetails.startDate,
          endDate: leagueDetails.endDate,
          budget: leagueDetails.investmentFunds,
          emails: emailsArray
        });
      })
    }
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
    const startDate = Date.parse(this.state.startDate);
    let daysBetween = Math.round((endDate-startDate)/86400000);
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
  update = () => {
    post(backend_url+'/leagues/update', {
      id: this.props.location.state.leagueDetails.id,
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
    }).catch(error => {this.setState({createError: 'only host user can update league'})});
  }
  save = () => {
    const errors = this.checkForNulls();
    if(!errors){
      if(this.props.location.state != null){
        this.update();
      }
      else{
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
    }
    this.setState({openDialog: true});
  }

  handleClose = () => {
    this.setState({openDialog: false});
  }
  redirectLeague = () => {
    this.setState({redirectLeague: true});
  }
  renderRedirect = () => {
    if(this.state.redirectLeague){
      return <Redirect to={"/league/"+this.state.name} />
    }
  }
  render(){
    let leagueDetails = null;
    if(this.props.location.state != null){
      leagueDetails = this.props.location.state.leagueDetails;
    }
    const purpleStyle = {color: '#7702fa', borderColor: '#7702fa', margin: '1em'}
    const dialogStyle = this.state.createError == null ? {backgroundColor: '#95DB7E'} : {backgroundColor: '#EA7E7E'}
    return(
      <div className="App">
        <div className="side-column">
          <a href="/home">
            <HomeIcon style={{color: '#FFFFFF', marginTop: '1em', fontSize: '2em'}} />
          </a>
        </div>
        <div className="home-container">
          <Header prevRoute={this.props.match.path} profilePicture={this.state.profilePicture} username={this.state.username} />
          <h2 style={{color: '#7702fa'}}>create new league</h2>
          <div className="form-container">
            <TextField
              key="league_name"
              style={purpleStyle}
              id="standard-full-width"
              label="name"
              variant="outlined"
              onChange={this.handleName}
              error={this.state.nameError}
              defaultValue={leagueDetails==null?null:leagueDetails.name}
            />
            <TextField
              key="league_budget"
              style={purpleStyle}
              id="standard-full-width"
              label="budget"
              variant="outlined"
              onChange={this.handleBudget}
              error={this.state.budgetError}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              defaultValue={leagueDetails==null?null:leagueDetails.investmentFunds}
              helperText={this.state.budgetError ? "must be at least $1000": ""}
            />
            <TextField
              key="league_start"
              style={purpleStyle}
              id="date"
              label="set start date"
              type="date"
              variant="outlined"
              onChange={this.handleStartDate}
              error={this.state.startDateError}
              defaultValue={leagueDetails==null?this.formatDate(this.state.todaysDate):leagueDetails.startDate}
              helperText={this.state.startDateError ? "start date must be after today": ""}
            />
            <TextField
              key="league_end"
              style={purpleStyle}
              id="date"
              label="set end date"
              type="date"
              variant="outlined"
              onChange={this.handleEndDate}
              error={this.state.endDateError}
              defaultValue={leagueDetails==null?this.formatDate(this.state.todaysDate):leagueDetails.endDate}
              helperText={this.state.endDateError ? "league must be at least 10 days": ""}
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
            {this.state.createError == null ?
              <DialogActions style={{backgroundColor: '#95DB7E'}}>
                <Button onClick={this.redirectLeague} variant="contained">
                  Go to League!
                </Button>
              </DialogActions> : null
            }
          </Dialog>
        </div>
        {this.renderRedirect()}
      </div>
    );
  }


}
export default CreateLeaguePage
