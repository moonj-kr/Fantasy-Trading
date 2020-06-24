import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;

class CreateLeaguePage extends React.Component{
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
          <Header profilePicture={this.state.profilePicture} username={this.state.username} />
          <div className="leagues-container">
            <LeaguesPreview leagues={this.state.leagues} leagueInfo={this.state.leagueInfo} />
          </div>
        </div>
      </div>
    );
  }


}
export default CreateLeaguePage
