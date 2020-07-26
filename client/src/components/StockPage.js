import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import HomeIcon from '@material-ui/icons/Home';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;
class StockPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: null,
      profilePicture: null
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
          <Header prevRoute={this.props.match.path} profilePicture={this.state.profilePicture} username={this.state.username} />
        </div>
      </div>
    )
  }
}
export default StockPage;
