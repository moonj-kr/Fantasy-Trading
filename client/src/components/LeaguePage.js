import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import SettingsIcon from '@material-ui/icons/Settings';
import { Redirect } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import LeagueRankings from './LeagueRankings.js'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
const axios = require('axios');
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;
const API_KEY = require('../utils/backendUrl.js').alpha_api_key;
const SEARCH_ENDPOINT =  require('../utils/backendUrl.js').alpha_search_endpoint;

class LeaguePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: null,
      profilePicture: null,
      redirectUpdate: false,
      leagueDetails: {},
      query: '',
      results: []
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
  getStockSuggestions = () => {
    axios.get(`${SEARCH_ENDPOINT}&keywords=${this.state.query}&apikey=${API_KEY}`).then(response => {
      this.setState({results: response.data.bestMatches});
    }).catch(error => {console.error(error)});
  }
  handleSearchChange = (event) => {
    this.setState({
      query: event.target.value
    }, () => {
      this.getStockSuggestions();
    });
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
          <div className="search">
            <div className="search-icon">
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Stocks..."
              classes={{
                root: "input-root",
                input: "input-input",
              }}
              onChange={this.handleSearchChange}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <StockSuggestions results={this.state.results} leagueId={this.state.leagueDetails.id} />
          <div className="leagueRankings-container">
            {this.state.leagueDetails.id ? <LeagueRankings leagueID={this.state.leagueDetails.id} /> : null}
          </div>
          {this.renderRedirectToUpdate()}
        </div>
      </div>
    )
  }

}
class StockSuggestions extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let symbol = "1. symbol";
    let name = "2. name";
    return(
      <ul className="stock-suggestions">
        {this.props.results.map(result => (
          <a href={"/stock/"+result[symbol]+"/"+this.props.leagueId} style={{textDecoration: 'none'}} >
            <li className="suggestion" key={result[symbol]}>
              <p className="suggestion-symbol">{result[symbol]}</p>
              <p className="suggestion-name">{result[name]}</p>
              <OpenInNewIcon style={{display: 'inline-flex', verticalAlign: 'middle', fontSize: 'medium', marginLeft: '0.5em'}}/>
            </li>
          </a>
        ))}
      </ul>
    )
  }
}
export default LeaguePage;
