import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import StarIcon from '@material-ui/icons/Star';
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;

class GlobalRanking extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentRank: 0,
      changeInPoints: 0,
      points: 0,
      leaderboard: []
    }
  }
  componentDidMount(){
    get(backend_url+'/ranking/global').then(response => {
      this.setState({
        currentRank: response.data.rank,
        changeInPoints: response.data.changeInPoints,
        points: response.data.points
      });
    }).catch(error => {console.log(error)});
    get(backend_url+'/ranking/globalRankings').then(response => {
      this.setState({
        leaderboard: response.data
      });
    }).catch(error => {console.log(error)});
  }
  render(){
    console.log(this.state.changeInPoints);
    let iconAlignStyle = {verticalAlign: 'middle', margin: 'auto'}
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
              <h3 className="rank" style={{marginRight: '1.25em'}}>{this.state.changeInPoints}
                {this.state.changeInPoints<0 ? <ArrowDropDownIcon style={iconAlignStyle} /> : <ArrowDropUpIcon style={iconAlignStyle} />}
              </h3>
              <h3 className="rank" style={{marginLeft: '1.25em'}}>{this.state.points}</h3>
            </div>
          </div>
        </div>
        <h3 style={{color: '#7702fa', marginBlockStart: '0px', marginBlockEnd: '0px', marginTop: '1em'}}><StarIcon style={iconAlignStyle} />top players</h3>
        <LeaderboardLabel />
        <div className="leaderboard-container">
          {this.state.leaderboard.map((player, index) => (
            <Player details={player} rank={index+1} />
          ))}
        </div>
      </div>
    )
  }
}
class Player extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let iconAlignStyle = {verticalAlign: 'middle', margin: 'auto'}
    return(
      <div className="player">
        <h3 className="player-rank" style={{marginLeft: '1em'}}>{this.props.rank}</h3>
        <h3 className="player-rank" style={{marginLeft: '1.5em'}}>{this.props.details.username}</h3>
        <h3 className="player-rank" style={{marginLeft: '10.5em'}}>
          {this.props.details.changeInPoints}
          {this.props.details.changeInPoints<0 ? <ArrowDropDownIcon style={iconAlignStyle} /> : <ArrowDropUpIcon style={iconAlignStyle} />}
        </h3>
        <h3 className="player-rank" style={{marginLeft: '4em'}}>{this.props.details.points}</h3>
      </div>
    )
  }
}
class LeaderboardLabel extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        <p className="player-rank" style={{marginLeft: '1em', marginBottom: '0em'}}>rank</p>
        <p className="player-rank" style={{marginLeft: '1em', marginBottom: '0em'}}>username</p>
        <p className="player-rank" style={{marginLeft: '8em', marginBottom: '0em'}}>change</p>
        <p className="player-rank" style={{marginLeft: '2em', marginBottom: '0em'}}>points</p>
        <p className="player-rank" style={{marginLeft: '3em', marginBottom: '0em'}}>rank</p>
        <p className="player-rank" style={{marginLeft: '1em', marginBottom: '0em'}}>username</p>
        <p className="player-rank" style={{marginLeft: '8em', marginBottom: '0em'}}>change</p>
        <p className="player-rank" style={{marginLeft: '2em', marginBottom: '0em'}}>points</p>
      </div>
    )
  }
}
export default GlobalRanking;
