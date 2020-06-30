import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/materialui1.css';
import '../stylesheets/materialui2.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Redirect } from 'react-router-dom';
import {createMuiTheme} from "@material-ui/core";

import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

const backend_url = require('../utils/backendUrl.js').backend_url;
const get = require('../utils/requests.js').getRequest;

class LeaguePortfolioGraph extends React.Component{
	constructor(props){
    	super(props);
    	this.state = {
      		arrowUp: true,
			dataLine:{
				labels: ["5/21", "5/22", "5/23", "5/24", "5/25", "5/26", "5/27"],
				datasets: [
        			{
					  label: false,
					  fill: false,
					  lineTension: 0.1,
					  backgroundColor: "rgba(225, 204,230, .3)",
					  borderColor: "rgb(119,2,250)",
					  borderCapStyle: "butt",
					  borderDash: [],
					  borderDashOffset: 0.0,
					  borderJoinStyle: "miter",
					  pointBorderColor: "rgb(205, 130,1 58)",
					  pointBackgroundColor: "rgb(255, 255, 255)",
					  pointBorderWidth: 10,
					  pointHoverRadius: 5,
					  pointHoverBackgroundColor: "rgb(0, 0, 0)",
					  pointHoverBorderColor: "rgba(220, 220, 220,1)",
					  pointHoverBorderWidth: 2,
					  pointRadius: 1,
					  pointHitRadius: 10,
					  data: [65, 59, 80, 81, 56, 55, 40],
						options: { legend: { display: false } }
        			}
        		],
			}
		}
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
    let arrowIconStyle = {verticalAlign: 'middle', margin: 'auto'}
    let dropdownMenuStyle = {color: '#7702fa'}
    let menuListStyle = {backgroundColor: '#E5E8E8', borderRadius: '1em'}
    return(
      <div className="portfolioGraph">
        <div style={{paddingLeft: '1em'}}>
          <h3 onClick={this.onExpand} className="header-text">{"portfolio"}
            {this.state.arrowUp ?
              <ArrowDropDownIcon style={arrowIconStyle}/>
				: <ArrowDropUpIcon style={arrowIconStyle}/>
            }
          </h3>
          {this.state.arrowUp ?
			<MDBContainer>
        		<Line data={this.state.dataLine} options={{ responsive: true }, {legend:{display:false}}} />
      		</MDBContainer>
            : null
          }
        </div>
    </div>
    );
  }
}

export default LeaguePortfolioGraph;