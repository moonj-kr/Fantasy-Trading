import React from 'react';
import './stylesheets/App.css';
import './stylesheets/materialui1.css';
import './stylesheets/materialui2.css';
import './stylesheets/App.css';

class LeaguesPreview extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        <h2 style={{color: '#7702fa'}}>current leagues</h2>
        <ul className="leagues-container">
          {this.props.leagues.map(league => (
            <div className="league">
              {league}
            </div>
          ))}
        </ul>
      </div>
    )
  }
}
export default LeaguesPreview;
