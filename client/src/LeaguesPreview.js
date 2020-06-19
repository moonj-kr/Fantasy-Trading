import React from 'react';
import './stylesheets/App.css';
import './stylesheets/materialui1.css';
import './stylesheets/materialui2.css';
import './stylesheets/App.css';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';

class LeaguesPreview extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let linkStyle = {color: '#7702fa', fontWeight: 'bold'}
    return(
      <div>
        <h2 style={{color: '#7702fa'}}>current leagues</h2>
        <ul className="leagues-container">
          {Object.entries(this.props.leagueInfo).map(([league, daysRemaining]) => (
            <div className="league">
              <a style={linkStyle} href="http://www.google.com">{league}</a>
              <p style={{color: '#7702fa', fontSize: '0.75em'}}>
                <HourglassFullIcon style={{fontSize: 'small', position: 'absolute'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                ends in {daysRemaining} days
              </p>
            </div>
          ))}
          <div className="league">
            <a style={linkStyle} href="http://www.google.com">+ create a new league</a>
          </div>
        </ul>
      </div>
    )
  }
}
export default LeaguesPreview;
