import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import SettingsIcon from '@material-ui/icons/Settings';
import { Redirect } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import LeagueRankings from './LeagueRankings.js'
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class LeaguePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: null,
      profilePicture: null,
      redirectUpdate: false,
      leagueDetails: {}
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

    //grab the name of the league from the url
    let pathVar = window.location.pathname.split('/')[2];
    let leagueName = pathVar.replace('%20', " ");
    get(backend_url+'/leagues/list/'+leagueName).then(response => {
      this.setState({leagueDetails: response.data})
    });
    this.setState({render: true});
  }
  redirectToUpdate = () => {
    if(this.state.redirectUpdate){
      this.setState({redirectUpdate: false});
    }
    else{
      this.setState({redirectUpdate: true});
    }
  }
  renderRedirectToUpdate = () => {
    if(this.state.redirectUpdate){
      return <Redirect to={{
        pathname: "/create",
        state: {leagueDetails: this.state.leagueDetails}
        }}
        />
    }
  }
  render(){
    return(
      <div className="App">
        <div className="side-column">
          <a href="/home">
            <HomeIcon style={{color: '#FFFFFF', marginTop: '1em', fontSize: '2em'}} />
          </a>
        </div>
        <div className="home-container">
          <Header prevRoute={this.props.match.url} profilePicture={this.state.profilePicture} username={this.state.username} />
          <div className="league-header">
            <h3>{this.state.leagueDetails.name}</h3>
            <SettingsIcon onClick={this.redirectToUpdate} style={{marginLeft: 'auto'}} />
          </div>
          <div className="league-details">
            <div className="league-detail" style={{marginRight: 'auto'}}>
              <h5 className="league-column">given budget</h5>
              <p>${this.state.leagueDetails.investmentFunds}</p>
            </div>
            <div className="league-detail">
              <h5 className="league-column">start</h5>
              <p>{this.state.leagueDetails.startDate}</p>
            </div>
            <div className="league-detail">
              <h5 className="league-column">end</h5>
              <p>{this.state.leagueDetails.endDate}</p>
            </div>
          </div>
          <div className="leagueRankings-container">
            {this.state.leagueDetails.id ? <LeagueRankings leagueID={this.state.leagueDetails.id} /> : null}
          </div>
          {this.renderRedirectToUpdate()}
        </div>
      </div>
    )
  }

}
export default LeaguePage;
