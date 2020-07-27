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
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import green from '@material-ui/core/colors/green';

import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;
const backend_url = require('../utils/backendUrl.js').backend_url;
const pathVar = window.location.pathname.split('/')[2];
//const leagueName = pathVar.replace('%20', " ");

// test arrays
let prevValues =[700.11,770.36,620.21,810.55,888.62,970.37,720.12,800.99,930.54,1000.26,1200.16,1251.00,1103.46,1225.73,1536.27,1901.34];
let datesArray = ['2020-07-01 11:35:26.315+09', '2020-07-02 11:35:50.313+09', '2020-07-03 11:35:50.313+09','2020-07-04 11:35:50.313+09','2020-07-05 11:35:50.313+09','2020-07-06 11:35:50.313+09','2020-07-07 11:35:50.313+09','2020-07-08 11:35:50.313+09','2020-07-09 11:35:50.313+09','2020-07-10 11:35:50.313+09','2020-07-11 11:35:50.313+09','2020-07-12 11:35:50.313+09','2020-07-13 11:35:50.313+09','2020-07-14 11:35:50.313+09','2020-07-15 11:35:50.313+09','2020-07-16 11:35:50.313+09'];

class LeaguePortfolioGraph extends React.Component{
	constructor(props){
    	super(props);
    	this.state = {
      		arrowUp: true,
			graphView: "",
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
		} else {
		  this.setState({arrowUp: true});
		}
	};

	updateGraph = (graphView) => {
//		let leagueID = get(backend_url+'/leagues/list/' + leagueName);
//		let data = post(backend_url+'/portfolio/prevValues/' + leagueID);

		//post(backend_url+'/portfolio/
		//this.setState(alert(leagueID));
		//TODO: add highlight to button to indicate which graphView

		let parsedDates= [];

		for(let i = 0; i < datesArray.length; i++) {
			// TODO: Decide date display
			parsedDates.push(datesArray[i].split(" ")[0])
		}

		if(graphView == "") {
		} else if (graphView == "1D"){
			this.setState(this.state.dataLine.labels=parsedDates.slice(-2));
			this.setState(this.state.dataLine.datasets[0].data=prevValues.slice(-2));
	

			//this.setState(this.state.dataLine.datasets[0].data=[11,12,13,14,45,16,17]);

		} else if (graphView == "1W") {
			this.setState(this.state.dataLine.labels=parsedDates.slice(-7));
			this.setState(this.state.dataLine.datasets[0].data=prevValues.slice(-7));
	
		} else if (graphView == "1M") {
			this.setState(this.state.dataLine.labels=parsedDates.slice(-30));
			this.setState(this.state.dataLine.datasets[0].data=prevValues.slice(-30));
		
		} else if (graphView == "3M") {
			this.setState(this.state.dataLine.labels=parsedDates.slice(-90));
			this.setState(this.state.dataLine.datasets[0].data=prevValues.slice(-90));

		} else if (graphView == "1Y") {
			this.setState(this.state.dataLine.labels=parsedDates.slice(-360));
			this.setState(this.state.dataLine.datasets[0].data=prevValues.slice(-360));

		} else if (graphView == "ALL") {
			this.setState(this.state.dataLine.labels=parsedDates);
			this.setState(this.state.dataLine.datasets[0].data=prevValues);
		} else { // day 1
			//this.setState(this.state.dataLine.datasets[0].data=[1,2,3,4,5,6,7]);
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
			  	<div>
					<MDBContainer>
						<Line data={this.state.dataLine} options={{ responsive: true }, {legend:{display:false}}} />
					</MDBContainer>
					<Grid className="graph-buttons" container alignItems="flex-start" justify="flex-end" direction="row">
		 				<Button onClick={() => { this.updateGraph("1D")}} color="primary">1D</Button>
		 				<Button onClick={() => { this.updateGraph("1W")}} color="primary">1W</Button>
		 				<Button onClick={() => { this.updateGraph("1M")}} color="primary">1M</Button>
		 				<Button onClick={() => { this.updateGraph("3M")}} color="primary">3M</Button>
		 				<Button onClick={() => { this.updateGraph("1Y")}} color="primary">1Y</Button>
		 				<Button onClick={() => { this.updateGraph("ALL")}} color="primary">ALL</Button>
					</Grid>
				</div>
            : null
          }
        </div>
    </div>
    );
  }
}

export default LeaguePortfolioGraph;
