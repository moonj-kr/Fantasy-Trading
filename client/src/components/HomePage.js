import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;

class HomePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profilePicture: null,
      username: null,
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

  render(){
    return(
      <div className="App">
        <div className="side-column">
        </div>
        <div className="home-container">
          <Header prevRoute={this.props.match.path} profilePicture={this.state.profilePicture} username={this.state.username} />
          <div className="leagues-container">
            <LeaguesPreview  />
          </div>
        </div>
      </div>
    );
  }
}
class LeaguesPreview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      leagues: {},
      render: false
    }
  }
  componentDidMount(){
    get(backend_url+'/users/leagues').then(response => {
      var result = this.state.leagues;
      for(let i=0; i<response.data.length; i++){
        let name = response.data[i].name;
        let endDate = Date.parse(response.data[i].endDate)
        let currentDate = Date.now();
        let daysRemaining = Math.round((endDate-currentDate)/86400000);
        result[name] = [daysRemaining, response.data[i]];
      }
      this.setState({leagues: result});
    }).catch(error => {console.error(error)});
    this.setState({render: true});
  }
  render(){
    let linkStyle = {color: '#7702fa', fontWeight: 'bold'}
    return(
      <div>
        <h2 style={{color: '#7702fa', marginBlockStart: '0px', marginBlockEnd: '0px'}}>current leagues</h2>
        <ul className="leagues-container">
          {Object.entries(this.state.leagues).map(([league, [daysRemaining, data]]) => (
            <div key={league} className="league">
              <a style={linkStyle} href={"/league/" + data.name}>{league}</a>
              <p style={{color: '#7702fa', fontSize: '0.75em'}}>
                <HourglassFullIcon style={{fontSize: 'small', position: 'absolute'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                ends in {daysRemaining} days
              </p>
            </div>
          ))}
          <div className="league">
            <a style={linkStyle} href="/create">+ create a new league</a>
          </div>
        </ul>
      </div>
    )
  }
}

export default HomePage;
