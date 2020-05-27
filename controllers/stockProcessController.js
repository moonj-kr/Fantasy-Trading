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
		let stockSym = "IBM";
		let alphaFunction = "TIME_SERIES_DAILY_ADJUSTED";
		var date = new Date();

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
					let updatedDate = metaData["3. Last Refreshed"];
					let dates = json["Time Series (Daily)"];

					// most updated date: dates[updatedDate]
					let mostRecentStockPrices = dates[updatedDate];
					res.send(json);
					let openPrice = mostRecentStockPrices["1. open"]

					// put into stock table: symbol, price, isupdated
					Stock.update({ price: stockSym, isUpdated:true }, {
						where: {
							symbol: stockSym
						}
					});
					res.send(openPrice);
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
