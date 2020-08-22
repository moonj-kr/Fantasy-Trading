import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
const get = require('../utils/requests.js').getRequest;
const backend_url = require('../utils/backendUrl.js').backend_url;
class LeagueYourStocks extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stockDetails: [],
      arrowUp: false
    }
  }
  componentDidMount(){
    get(backend_url+'/portfolio/getStockDetails/'+this.props.leagueID).then(response => {
      let stocks = [];
      for( var symbol in response.data){
        let stock = {
          symbol: symbol,
          company: response.data[symbol].company,
          numShares: response.data[symbol].numShares,
          lastPrice: response.data[symbol].lastPrice,
          percentChange: response.data[symbol].percentChange,
          equity: response.data[symbol].equity
        }
        stocks.push(stock);
      }
      this.setState({stockDetails: stocks})
    }).catch(error => {console.error(error)});
  }
  onExpand = () => {
    if(this.state.arrowUp){
      this.setState({arrowUp: false});
    }
    else{
      this.setState({arrowUp: true});
    }
  }
  render(){
    let arrowIconStyle = {verticalAlign: 'middle', margin: 'auto'};
    return(
      <div style={{width:'100%', marginRight: 'auto', marginLeft: '1em'}}>
        <h3 onClick={this.onExpand} style={{color: '#7702fa', marginBlockStart: '0px', marginBlockEnd: '0px', marginTop: '1em'}}>your stocks
          {this.state.arrowUp ?
            <ArrowDropUpIcon style={arrowIconStyle}/>
            : <ArrowDropDownIcon style={arrowIconStyle}/>
          }
        </h3>
        {this.state.arrowUp ? <StockLabels /> : null}
        {this.state.arrowUp ?
          <div>
            {this.state.stockDetails.map((stock) => (
              <Stock details={stock} />
            ))}
          </div> : null}
      </div>
    )
  }
}
class Stock extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className="stock">
        <h3 className="stock-column" style={{width: '30%', marginLeft: '1em'}}>{this.props.details.company}</h3>
        <h3 className="stock-column" style={{width: '15%'}}>{this.props.details.symbol}</h3>
        <h3 className="stock-column" style={{width: '15%'}}>{this.props.details.numShares}</h3>
        <h3 className="stock-column" style={{width: '15%'}}>{this.props.details.lastPrice}</h3>
        <h3 className="stock-column" style={{width: '15%'}}>{this.props.details.percentChange}</h3>
        <h3 className="stock-column" style={{width: '15%'}}>{this.props.details.equity}</h3>
      </div>
    )
  }
}
class StockLabels extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className="labels">
        <p className="label" style={{width: '20em', marginRight: '1em'}}>company</p>
        <p className="label" style={{width: '10em'}}>symbol</p>
        <p className="label" style={{width: '10em'}}>#shares</p>
        <p className="label" style={{width: '10em'}}>last price</p>
        <p className="label" style={{width: '10em'}}>%change</p>
        <p className="label" style={{width: '10em'}}>equity</p>
      </div>
    )
  }
}

export default LeagueYourStocks;
