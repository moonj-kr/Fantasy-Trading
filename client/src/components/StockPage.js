import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import Header from './Header.js';
import HomeIcon from '@material-ui/icons/Home';
import {Button, ButtonGroup} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
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
      currPrice: 5,
      prevPrice: 0,
      percentChange: 0,
      leagueID: -1
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
    let leagueID = splitBySlash[splitBySlash.length-1];
    this.setState({symbol: symbol});
    this.setState({leagueID: parseInt(leagueID)});
    {get(backend_url+'/stock/price/'+symbol).then(response => {
      this.setState({
        currPrice: response.data.currPrice,
        prevPrice: response.data.prevPrice,
        percentChange: Math.floor(response.data.percentChange * 100) / 100,
        company: response.data.companyName
      });
    });}
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
          {this.state.leagueID != -1 ? <Transaction leagueID={this.state.leagueID} currPrice={this.state.currPrice} symbol={this.state.symbol}/> : null}
        </div>
      </div>
    )
  }
}
//Props passed to Transaction: currPrice, leagueID (to call portfolio details), symbol (get stockShares)
class Transaction extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      portfolioDetails: {},
      transactionType: 'buy',
      volume: 0,
      stockShares: 0,
      buyError: false,
      estimatedValue: 0,
      orderError: false,
      buySuccess: false,
      sellSuccess: false

    }
  }
  componentDidMount(){
    get(backend_url+'/portfolio/getPortfolio/'+this.props.leagueID).then(response => {
      this.setState({portfolioDetails: response.data})
    });
    get(backend_url+'/stock/shares/'+this.props.leagueID+'/'+this.props.symbol).then(response => {
      this.setState({stockShares: response.data.numShares})
    });
  }
  handleShares = (event) => {
    var volumeEvent = parseInt(event.target.value)
    this.setState({
      volume: volumeEvent
    },() => {this.setState({estimatedValue: this.state.volume*this.props.currPrice})});
  }
  onBuy = () => {
    if(this.state.transactionType != 'buy'){
      this.setState({transactionType: 'buy'})
    }
  }
  onSell = () => {
    if(this.state.transactionType != 'sell'){
      this.setState({transactionType: 'sell'})
    }
  }
  onOrder = () => {
    post(backend_url+'/transaction', {leagueID: this.props.leagueID, stockSymbol: this.props.symbol, volume: this.state.volume, type: this.state.transactionType}).then(response => {
      if(response.status === 201 || response.status === 200){
        if(this.state.transactionType == 'buy'){
          this.setState({
            buySuccess: true,
            orderError: false
          });
        }else{
          this.setState({
            sellSuccess: true,
            orderError: false
          });
        }
      }
    }).catch(error => {this.setState({buyError: true})});
  }
  availableBlock = () => {
    if(this.state.transactionType == 'buy'){
      return <div> <h4 style={{textAlign:'center', marginTop:'1em', marginBottom:'0.5em'}}>${this.state.portfolioDetails.buyingPower}</h4><h4 style={{textAlign:'center', marginTop:'0.5em', marginBottom:'1em'}}>available</h4> </div>
    }else{
      return <div><h4 style={{textAlign:'center', marginTop:'1em', marginBottom:'0.5em'}}>{this.state.stockShares}</h4><h4 style={{textAlign:'center', marginTop:'0.5em', marginBottom:'0em'}}>available</h4><h4 style={{textAlign:'center', marginBottom:'1em', marginTop:'0em'}}>shares</h4></div>
    }
  }

  render(){
    let transactionRowStyle;
    this.state.transactionType == 'buy' ? transactionRowStyle = {color: '#7702fa', backgroundColor: '#E5E8E8'} : transactionRowStyle = {color: '#FFFFFF', backgroundColor: '#7702fa'}
    return (
      <div>
        <div className="stock-transaction-type" >
          <ButtonGroup variant="contained" >
            <button className="transaction-type-button" style={{backgroundColor: '#E5E8E8', color: '#7702fa'}} onClick={this.onBuy}>Buy</button>
            <button className="transaction-type-button" style={{backgroundColor: '#7702fa', color: '#FFFFFF'}} onClick={this.onSell}>Sell</button>
          </ButtonGroup>
        </div>
        <div className="stock-transaction-row" >
          <div className="stock-transaction-buy" style={transactionRowStyle}>
            <div className="stock-transaction-shares" >
              <h4 style={{textAlign:'center', marginTop:'0.5em', marginBottom:'0.5em'}}>Shares</h4>
              <div className="stock-transaction-shares-textfield">
                <TextField
                  style={{width:'5em', marginBottom:'0.5em'}}id="number-shares"
                  onChange={this.handleShares}
                />
              </div>
            </div>
            <div className="stock-transaction-icon">x</div>
            <div className="stock-transaction-shares" >
              <h4 style={{textAlign:'center', marginTop:'0.5em', marginBottom:'0.5em'}}>Market Price</h4>
              <div className="stock-transaction-shares-textfield">
                <h4 style={{width:'center', marginTop:'0.5em', marginBottom:'0.5em'}}>${this.props.currPrice}</h4>
              </div>
            </div>
            <div className="stock-transaction-icon">=</div>
            <div className="stock-transaction-shares" >
              <h4 style={{textAlign:'center', marginTop:'0.5em', marginBottom:'0.5em'}}>Estimated Value</h4>
              <div className="stock-transaction-shares-textfield">
                <h4 style={{width:'center', marginTop:'0.5em', marginBottom:'0.5em'}}>${this.state.estimatedValue}</h4>
              </div>
            </div>
          </div>
          <div className="transaction-available" style={transactionRowStyle}>
            {this.availableBlock()}
          </div>
        </div>
        <button onClick={this.onOrder} className="order-button">Complete Order</button>
      </div>
    )
  }
}

export default StockPage;
