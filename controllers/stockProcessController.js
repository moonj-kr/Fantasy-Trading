const Stock = require('../models').Stock;
var request = require('request');
const fetch = require('node-fetch');
var schedule = require('node-schedule');

// to reset isUpdated values everyday at 5pm
async function resetUpdates() {
	var rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = [0,6]; // weekdays
	rule.hour = 17;
	rule.minute = 0;

	var j = schedule.scheduleJob(rule, function() {
		// reset stocks
		const allStocks = Stock.findAll();
		for(j = 0; allStocks[j]; j++) {
			Stock.update({isUpdated: false}, { // await
				where: {
					symbol: allStocks[j].symbol
				}
			});
		}
	});
}

async function doesStockExist(stockSym) {
	const stock = await Stock.findAll({
		where: {
			symbol: stockSym
		}
	});
	if(stock != null) {
		return true;
	} else{
		return false;
	}
}

module.exports = { 
	// test function for resetting updates
	async resetUpdates(req,res) {
		const allStocks = await Stock.findAll();
		for(j = 0; allStocks[j]; j++) {
			Stock.update({isUpdated: false}, {
				where: {
					symbol: allStocks[j].symbol
				}
			});
		}
		res.status(200).send("updated");
	},

	// check if stock is updated
	async isStockUpdated(req, res) {
		const stock =  await Stock.findOne({where: {symbol: req.params.symbol }});
		if(stock.isUpdated) {
			res.status(200).send("isUpdated");
		} else {
			res.status(200).send("notUpdated");
		}
	},

	// get stock from alpha & update our data table (fix date from alpha advantage)
	async updatePrice(req, res) {
		let key = "U864TMWAO0GRH22S";
		let stockSym = req.params.symbol;
		let alphaFunction = "TIME_SERIES_DAILY_ADJUSTED";

		fetch("https://www.alphavantage.co/query?function=" + alphaFunction + "&symbol=" + stockSym + "&apikey=" + key, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		},
		).then(response => {
			if(response.ok) {
				response.json().then(json => {
					// parsing data information
					let metaData = json["Meta Data"];
					var parsed = (metaData["3. Last Refreshed"]).split(" ");
					let updatedDate = parsed[0];
					let dates = json["Time Series (Daily)"];
					let recentUpdate = dates[updatedDate];
					let openPrice = recentUpdate["1. open"];

					// check if stock exists
					const exists = doesStockExist(stockSym);

					if(exists) {
						// put into stock table: symbol, price, isupdated
						Stock.update({ price: openPrice, isUpdated:true }, {
							where: {
								symbol: stockSym
							}
						});
						res.send("updated");
					} else {
						Stock.create({symbol: stockSym, price: openPrice, isUpdated: true});
						res.send("inserted");
					}
				});
			}
		});
	},

	// get stock price from our table
	async getStockPrice(req, res) {
		let stockSym = "IBM";
		const stock =  await Stock.findOne({where: {symbol: stockSym }});

		if(stock === null) {
			res.status(200).send("fail");
		} else {
			res.status(200).send(stock);
		}
	}
}
