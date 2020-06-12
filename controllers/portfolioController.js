const Portfolio = require('../models').Portfolio;
const User = require('../models').User;
const League = require('../models').League;
const Transaction = require('../models').Transaction;
const transactionController = require('./index.js').transactionController;
const config = require(`${__dirname}/../config/config.json`)[env];
var schedule = require('node-schedule');

// get current stock price helper fn
async function getCurrentPrice(key, symbol) {
	let stockPrice;
		try {
			currentPrice = await get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`);
		} catch (error) {
			console.log(error)
		}
	return(currentPrice);
}

// needs testing
async function scheduleJob() {
	let portfolios = await Portfolio.findAll();
	for(var i = 0; portfolios[i]; i++) {
		let portfolio = portfolios[i];
		let transactions = await Transaction.findAll({where: {portfolioID: portfolio.id}});
		for(var j = 0; transactions[j]; j++) {
			let transaction = transactions[j];
			let key = config.api_key;*;

			// get current stock price api & delay 1 minute
			let currentPrice = setTimeout(getCurrentPrice, 60000, transaction.stockSymbol, key);

			// consider adding error catching for transaction & portfolio
			let newValue = portfolio.value + (transaction.volume * currentPrice);
			let value = portfolio.value + (transaction.volume * currentPrice)
			let percentChanged =  (newValue - portfolio.value)/ portfolio.value;

			// update portfolio
			await Portfolio.update({value: value, percentChanged: percentChanged}, {
				where: {
					id: portfolio.id
				}
			});
			portfolio.save();
		}
	}
	res.status(200).send("job scheduled");
}

module.exports = {
	// get portfolio detail by leagueID
	async getPortfolio(req, res) {
		let sessionID = req.sessionID;
		let leagueID = req.params.leagueID;
		let user = await User.findOne({where: {sessionID: sessionID}});
		let portfolio = await Portfolio.findOne({where: {userID: user.id, leagueID: leagueID}});
		
		if(portfolio == null) {
			res.status(404).send("Portfolio Does Not Exist");
		}
		res.status(200).send(JSON.stringify(portfolio));
	},

	// get all transactions within a portfolio by portfolio id
	async getAllTransactions(req, res) {
		let portfolioID = req.params.portfolioID;
		let portfolio = await Portfolio.findOne({where: {id: portfolioID}});
		let transactions = await Transaction.findAll({where: {portfolioID: portfolioID}}); 

		if(portfolio == null) {
			res.status(404).send("Portfolio does not exist");
		}
		res.status(200).send(JSON.stringify(transactions));
	},

	// get stock details from a portfolio by session id and league id
	async getStockDetails(req, res) {
		let sessionID = req.sessionID;
		let leagueID = req.params.leagueID;
		let league = await League.findOne({where: {id: leagueID}});
		let user = await User.findOne({where: {sessionID: sessionID}});
		let portfolio = await Portfolio.findOne({where: {userID: user.id, leagueID: leagueID}});

		// check to make sure await statement is valid
		let transactions = null;
		if(portfolio != null) {
			transactions = await Transaction.findAll({where: {portfolioID: portfolio.id}});
		}

		// let currPrice = transactionController.getTransaction();
		let currPrice = 120.87; // hardcoded for now
		let transactionsResponse = {};

		// user error handling
		let errorResponse= "";
		if(league == null) {
			errorResponse = "League does not exist";
		} else if(user == null) {
			errorResponse = "Error with sessionID. User does not exist";
		} else if(portfolio == null) {
			errorResponse = "Portfolio does not exist";
		} else if(transactions == null) {
			errorResponse = "Transactions do not exist for this portfolio.";
		}
		
		if(transactions != null) {
			for(var i = 0; transactions[i]; i++) {
				let transaction = transactions[i];
				let sym = transaction.stockSymbol;
				let vol = transaction.volume;
				let price = transaction.price;

				let numShares = 0;
				let equity = 0;
			

				if(transactionsResponse[sym] != undefined) {
					if(transactionsResponse[sym].numShares != undefined) {
						numShares = transactionsResponse[sym].numShares;
						res.send("first");
					} else if (transactionsResponse[sym].equity != undefined) {
						let equity = transactionsResponse[sym].equity;
						res.send("third");
					}
				} else {
					// to avoid undefined errors
					transactionsResponse[sym] = {};
				}

				if(transaction.type == 'buy') {
					transactionsResponse[sym].numShares = numShares + vol;
					transactionsResponse[sym].equity = equity + (price * vol);
					let avgStockPrice = transactionsResponse[sym].equity / transactionsResponse[sym].numShares;
					transactionsResponse[sym].percentChange = (currPrice - avgStockPrice)/avgStockPrice;

				} else if(transaction.type == 'sell') {
					transactionsResponse[sym] = sym;
					transactionsResponse[sym].numShares = numShares - vol;
					transactionsResponse[sym].equity = equity - (price * vol);
						
					let avgStockPrice = transactionsResponse[sym].equity / transactionsResponse[sym].numShares;
					transactionsResponse[sym].percentChange = (currPrice - avgStockPrice) / avgStockPrice;

				} else {
					transactionsResponse[sym] = {
						numShares: numShares,
						lastPrice: currPrice,
						percentChange: ((currPrice - price) / price),
						equity: price * vol
					}
				}
			}
		}

		if(errorResponse == "") {
			res.status(200).send(JSON.stringify(transactionsResponse));
		}
		res.status(404).send(errorResponse);
	},

	// get portfolio value + buying power from userID and leagueID
	async getCurrentBalance(req, res) {
		let sessionID = req.sessionID;
		let leagueID = req.params.leagueID;
		let user = await User.findOne({where: {sessionID: sessionID}});
		let league = await League.findOne({where: {id: leagueID}}); // 2
		let portfolio = null;
		let currentBalance = null;
		if(league != null) {
			portfolio = await Portfolio.findOne({where: {userID: user.id, leagueID: leagueID}});
		}
		if(portfolio != null) {
			currentBalance = portfolio.value + portfolio.buyingPower;
		}

		// user error handling
		let responseMessage = "";
		if(user == null) {
			responseMessage = "Error with sessionID. User does not exist";
		} else if(league == null) {
			responseMessage = "League does not exist";
		} else if(typeof(currentBalance) == "number"){
			responseMessage = currentBalance.toString();
			res.status(200).send(responseMessage);
		}
		res.status(400).send(responseMessage);
	}
}
