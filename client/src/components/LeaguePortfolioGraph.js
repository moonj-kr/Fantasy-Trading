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
import waterfall from 'async/waterfall';

import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

const get = require('../utils/requests.js').getRequest;
const post = require('../utils/requests.js').postRequest;
const backend_url = require('../utils/backendUrl.js').backend_url;

class LeaguePortfolioGraph extends React.Component{
	constructor(props){
    	super(props);
    	this.state = {
      		arrowUp: true,
			graphView: "",
			leagueID: null,
			prevValues: [],
			datesArray: [],
			dataLine:{
				labels: [], // starter label for graph
				datasets: [
        			{
					  label:false, 
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
					  data: [], // starter data for graph
						options: { legend: { display: false } }
        			}
        		],
			}
		}
	}
	componentDidMount(){
		let pathVar = window.location.pathname.split('/')[2];
		let leagueName = pathVar.replace('%20', " ");
		this.getData(leagueName);
	}

// get request functions
	async getData(leagueName) {
		// get leagueID
		await get(backend_url+'/leagues/list/'+leagueName).then(response => {
			this.setState({
			  	leagueID: response.data.id
		  	});
		});

		// get prevValues
		await get(backend_url+'/portfolio/prevValues/'+this.state.leagueID).then(response => {
			this.setState({
				prevValues: response.data
		  	});
		});

		// get datesArray
		await get(backend_url+'/portfolio/getDates/'+this.state.leagueID).then(response => {
			this.setState({
				datesArray: response.data
		  	});
		});
	};

	onExpand = () => {
		if(this.state.arrowUp){
		  this.setState({arrowUp: false});
		} else {
		  this.setState({arrowUp: true});
		}
	};

	updateGraph = (graphView) => {
		//TODO: add highlight to button to indicate which graphView
		let datesArray = this.state.datesArray;
		let prevValues = this.state.prevValues;

		let parsedDates= [];

		for(let i = 0; i < datesArray.length; i++) {
			// TODO: Decide date display
			parsedDates.push(datesArray[i].split(" ")[0])
		}

		if(graphView == "") {
		} else if (graphView == "1D"){
			this.setState(this.state.dataLine.labels=parsedDates.slice(-2));
			this.setState(this.state.dataLine.datasets[0].data=prevValues.slice(-2));
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
			// decide default graph
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
