import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;

class LeagueRankings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      arrowUp: false,
      leaderboard: []
    }
  }
  componentDidMount(){
    console.log(this.props)
    //grab leaderboard for current league
    get(backend_url+'/ranking/leagueRankings/'+this.props.leagueID).then(response => {
      console.log(response.data)
      this.setState({leaderboard: response.data})
    });
    this.setState({render: true});
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
    console.log(this.state.leaderboard)
    let iconAlignStyle = {verticalAlign: 'middle', margin: 'auto'}
    let arrowIconStyle = {verticalAlign: 'middle', margin: 'auto'}
    return(
      <div style={{width:'100%', marginRight: 'auto'}}>
        <h3 onClick={this.onExpand} style={{color: '#7702fa', marginBlockStart: '0px', marginBlockEnd: '0px', marginTop: '1em'}}>leaderboard
          {this.state.arrowUp ?
            <ArrowDropUpIcon style={arrowIconStyle}/>
            : <ArrowDropDownIcon style={arrowIconStyle}/>
          }
        </h3>
        {this.state.arrowUp ? <LeaderboardLabel /> : null}
        {this.state.arrowUp ?
          <div className="leaderboard-container">
            {this.state.leaderboard.map((player) => (
              <Player details={player} />
            ))}
          </div> : null}
      </div>
    )
  }
}
class Player extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: null
    }
  }
  componentDidMount(){
    console.log(this.props)
    //grab username
    get(backend_url+'/users/username/'+this.props.details.userID).then(response => {
      this.setState({username: response.data})
    })
    this.setState({render: true});
  }

  render(){
    let iconAlignStyle = {position: 'absolute', float: 'right', marginLeft: '0.5em'}
    return(
      <div className="player-leagues">
        <h3 className="player-rank" style={{width: '9%', marginLeft: '1%'}}>{this.props.details.ranking}</h3>
        <h3 className="player-rank" style={{width: '60%'}}>{this.state.username}</h3>
        <h3 className="player-rank" style={{width: '15%'}}>${this.props.details.value}</h3>
        <h3 className="player-rank" style={{width: '5%'}}>
          {this.props.details.percentChange>0 ? '+' : '-'}
          {this.props.details.percentChange}
        </h3>
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
        <p className="league-ranking-labels" style={{width: '9%', marginLeft: '1%', marginBottom: '0em'}}>rank</p>
        <p className="league-ranking-labels" style={{width: '60%', marginBottom: '0em'}}>user</p>
        <p className="league-ranking-labels" style={{width: '15%', marginBottom: '0em'}}>total value</p>
        <p className="league-ranking-labels" style={{width: '5%', marginBottom: '0em'}}>%change</p>
      </div>
    )
  }
}
export default LeagueRankings;
