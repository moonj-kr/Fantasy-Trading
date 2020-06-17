import React from 'react';
import './stylesheets/materialui1.css';
import './stylesheets/materialui2.css';
import './stylesheets/App.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
const backend_url = require('./utils/backendUrl.js').backend_url;
const axios = require('axios')


class SideNav extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      leagues: [],
      leagueArrowUp: false
    };
  }
  handleLeagues = () => {
    //make a call to backend api that gets all the leagues of the user logged in
    if(this.state.leagues.length === 0){
      axios.get(backend_url+'/users/leagues', {withCredentials: true, headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}}).then(response => {
        var resArr = [];
        for(let i=0; i<response.data.length; i++){
          resArr.push(response.data[i].name);
        }
        this.setState({
          //leagues: Object.values(response.data),
          leagues: resArr,
          leagueArrowUp: true
        });
      }).catch(error => {console.error(error)});
    }
    else{
      this.setState({
        leagues:[],
        leagueArrowUp: false
      });
    }
  }
  render(){
    let textColor = {color: '#895df1', fontWeight: 'bold'};
    return(
      <div className="side-nav">
        <div>
          <h3 className="text-color">welcome @username</h3>
        </div>
        <div className="menu">
          <MenuList>
            <MenuItem style={textColor}>stocks</MenuItem>
            <MenuItem style={textColor} onClick={this.handleLeagues}>
              leagues{this.state.leagueArrowUp ? <ArrowDropUpIcon />: <ArrowDropDownIcon />}
            </MenuItem>
              {this.state.leagues.map(league => (
                <MenuItem style={{paddingLeft: '1.5em', color: '#7F2A9E'}}>{league}</MenuItem>
              ))}
            {this.state.leagueArrowUp ? <MenuItem style={{paddingLeft: '1.5em', color: '#7F2A9E'}}>create new league</MenuItem> : null}
            <MenuItem style={textColor}>global</MenuItem>
          </MenuList>
        </div>
        <footer className="footer">
          <a href="https://github.com/moonj-kr/Fantasy-Trading">edit profile</a>
          <br></br>
          <a href="https://github.com/moonj-kr/Fantasy-Trading">logout</a>
        </footer>
      </div>
    );
  }
}
export default SideNav;
