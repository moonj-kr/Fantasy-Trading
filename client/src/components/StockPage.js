import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import HomeIcon from '@material-ui/icons/Home';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;
class StockPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: null,
      profilePicture: null,
      symbol: null,
      company: 'API LIMIT EXCEEDED',
      currPrice: 0,
      prevPrice: 0,
      percentChange: 0

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
    let url = window.location.href;
    let splitBySlash = url.split('/');
    let symbol = splitBySlash[splitBySlash.length-2];
    this.setState({symbol: symbol});
    get(backend_url+'/stock/price/'+symbol).then(response => {
      this.setState({
        currPrice: response.data.currPrice,
        prevPrice: response.data.prevPrice,
        percentChange: Math.floor(response.data.percentChange * 100) / 100,
        company: response.data.companyName
      });
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
          <div className="stock-details">
            <h2 className="stock-headers">{this.state.company}</h2>
            <h2 className="stock-headers" style={{marginLeft: 'auto'}}>${this.state.currPrice}</h2>
          </div>
          <div className="stock-details">
            <h4 className="stock-headers">{this.state.symbol}</h4>
            <h4 className="stock-headers" style={{marginLeft: 'auto'}}>${this.state.prevPrice}({this.state.percentChange})</h4>
          </div>
          <div id="stock-widget" style={{height: '15em'}}>
            <TradingViewWidget
              symbol={this.state.symbol}
              autosize
            />
          </div>
        </div>
      </div>
    )
  }
}

export default StockPage;
