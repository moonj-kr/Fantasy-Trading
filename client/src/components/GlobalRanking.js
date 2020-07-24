import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;

class GlobalRanking extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentRank: 0,
      changeInPoints: 0,
      points: 0
    }
  }
  componentDidMount(){
    get(backend_url+'/ranking/global').then(response => {
      console.log(response);
      this.setState({
        currentRank: response.data.rank,
        changeInPoints: response.data.changeInPoints,
        points: response.data.points
      });
    }).catch(error => {console.log(error)})
  }
  render(){
    console.log(this.state.changeInPoints);
    let arrowIconStyle = {verticalAlign: 'middle', margin: 'auto'}
    return(
      <div>
        <h2 style={{color: '#7702fa', marginBlockStart: '0px', marginBlockEnd: '0px'}}>global ranking</h2>
        <div className="currentrank-container">
          <div className="circle-rank">
            <p className="rank" style={{marginTop: '1.5em', fontSize: '0.75em'}}>rank</p>
            <h3 className="rank">#{this.state.currentRank}</h3>
          </div>
          <div className="points-rank">
            <div style={{display: 'inline-flex'}}>
              <p className="rank" style={{fontSize: '0.75em', marginTop: '1.5em',  marginLeft: '1.5em',  marginRight: '1.5em'}}>change</p>
              <p className="rank" style={{fontSize: '0.75em', marginTop: '1.5em',  marginLeft: '1.5em',  marginRight: '1.5em'}}>points</p>
            </div>
            <div style={{display: 'inline-flex', marginTop: '0em'}}>
              <h3 className="rank" style={{marginRight: '1.25em'}}>{this.state.changeInPoints}<ArrowDropUpIcon style={arrowIconStyle} /></h3>
              <h3 className="rank" style={{marginLeft: '1.25em'}}>{this.state.points}</h3>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
export default GlobalRanking;
