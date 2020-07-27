const Portfolio = require('../models').Portfolio;
const User = require('../models').User;
const League = require('../models').League;
const Transaction = require('../models').Transaction;
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
var schedule = require('node-schedule');
var cronJob = require('cron').CronJob;
const get = require('../utils/request').getRequest;

// get current stock price helper fn
async function getCurrentPrice(key,symbol) {
  let stockPrice;
  try {
    //stockPrice = await get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`);
    stockPrice = await get (`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`)
  } catch (error) {
    console.log(error)
  }
  //return stockPrice.data["Global Quote"]["05. price"];
  return stockPrice.data['c'];
}
// get current stock price helper fn
async function getPreviousClosePrice(key,symbol) {
  let stockPrice;
  try {
    //stockPrice = await get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`);
    stockPrice = await get (`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`)
  } catch (error) {
    console.log(error)
  }
  //return stockPrice.data["Global Quote"]["05. price"];
  return stockPrice.data['pc'];
}
async function getCompany(symbol){
  let company;
  try{
    company = await get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`)
  }catch(error){
    console.log(error);
  }
  return company.data.name
}

function setTimeoutForAlpha(key, symbol) {
   var promise = new Promise(function(resolve, reject) {
     setTimeout(async function() {
       resolve(await getCurrentPrice(key, symbol));
     }, 60000);
   });
   return promise;
}


// scheduling job helper fn
async function scheduleJob() {
	let portfolios = await Portfolio.findAll();
	for(var i = 0; portfolios[i]; i++) {
		let portfolio = portfolios[i];
		let transactions = await Transaction.findAll({where: {portfolioID: portfolio.id}});
    let prevValuesArr = portfolio.prevValues;
    let datesArray = portfolio.datesArray;
    prevValuesArr.push(portfolio.value);
    datesArray.push(new Date()-1);
		for(var j = 0; transactions[j]; j++) {
			let transaction = transactions[j];
			let key = config.api_key;
      let currentPrice;
      // get current stock price api & delay 1 minute
      try{
        currentPrice = await getCurrentPrice(key, transaction.stockSymbol);
      }catch(error){
        currentPrice = await setTimeoutForAlpha(key, transaction.stockSymbol);
      }
			// consider adding error catching for transaction & portfolio
			let newValue = portfolio.value + (transaction.volume * currentPrice);
			let percentChanged =  (newValue - portfolio.value)/ portfolio.value;


			// update portfolio
			await Portfolio.update({value: newValue, percentChanged: percentChanged, prevValues: prevValuesArr}, {
				where: {
					id: portfolio.id
				}
			});
			portfolio.save();
		}
	}
}

module.exports = {
	extScheduleJob() {
		var job = new cronJob('0 17 * * *', function() {
			console.log('five pm test');
			scheduleJob();
		}, null, true, 'America/Los_Angeles');
		job.start();
	},
  async getStockPrice(req, res){
    let key = config.api_key;
    let currPrice = await getCurrentPrice(key, req.params.symbol);
    let previousPrice = await getPreviousClosePrice(key, req.params.symbol);
    let companyName = await getCompany(req.params.symbol);
    if(currPrice != null && previousPrice != null){
      let percentChange = ((currPrice-previousPrice)/previousPrice)*100;
      res.status(200).send({currPrice: currPrice, prevPrice: previousPrice, percentChange: percentChange, companyName: companyName});
    }
    else {
      res.status(400).send({error: 'could not find data for stock'});
    }
  },
	// get portfolio detail by leagueID
	async getPortfolio(req, res) {
		let sessionID = req.sessionID;
		let leagueID = req.params.leagueID;
		let user = await User.findOne({where: {sessionID: sessionID}});
		let portfolio = await Portfolio.findOne({where: {userID: user.id, leagueID: leagueID}});
		if(portfolio == null) {
			res.status(404).send("Portfolio Does Not Exist");
		}
		res.status(200).send(portfolio);
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

		let key = config.api_key;
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
        let currPrice;
				if(sym in transactionsResponse){
          currPrice = transactionsResponse[sym].lastPrice;
					let existingNumShares = transactionsResponse[sym].numShares;
					let existingEquity = transactionsResponse[sym].equity;
					if(transaction.type == 'buy') {
						transactionsResponse[sym].numShares = existingNumShares + vol;
						transactionsResponse[sym].equity = existingEquity + (price * vol);
						let avgStockPrice = transactionsResponse[sym].equity / transactionsResponse[sym].numShares;
						transactionsResponse[sym].percentChange = (currPrice - avgStockPrice)/avgStockPrice;

					} else if(transaction.type == 'sell') {
						transactionsResponse[sym].numShares = existingNumShares - vol;
						transactionsResponse[sym].equity = existingEquity - (price * vol);
						let avgStockPrice = transactionsResponse[sym].equity / transactionsResponse[sym].numShares;
						transactionsResponse[sym].percentChange = (currPrice - avgStockPrice) / avgStockPrice;
					}
				}
				 else {
           // try{
           //   currPrice = await getCurrentPrice(keys[key_index], sym);
           // }
           // catch(error){
           //   currPrice = await setTimeoutForAlpha(keys[key_index], sym);
           // }
           currPrice = await getCurrentPrice(key, sym);

					transactionsResponse[sym] = {
						numShares: vol,
						lastPrice: currPrice,
						percentChange: ((currPrice - price) / price),
						equity: price * vol
					}
				}
			}
		}

		if(errorResponse == "") {
			res.status(200).send(transactionsResponse);
		}
		else{
			res.status(404).send(errorResponse);
		}
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
		else{
			res.status(400).send(responseMessage);
		}
	},
  async getPreviousValues(req, res){
    let sessionID = req.sessionID;
		let leagueID = req.params.leagueID;
		let user = await User.findOne({where: {sessionID: sessionID}});
		let league = await League.findOne({where: {id: leagueID}});
		let portfolio = null;
		let prevValues = null;
		if(league != null) {
			portfolio = await Portfolio.findOne({where: {userID: user.id, leagueID: leagueID}});
		}
		if(portfolio != null) {
			prevValues = portfolio.prevValues;
		}

		// user error handling
		let responseMessage = "";
		if(user == null) {
			responseMessage = "Error with sessionID. User does not exist";
		} else if(league == null) {
			responseMessage = "League does not exist";
		} else if(prevValues != null){
			res.status(200).send(prevValues);
		}
		else{
			res.status(400).send(responseMessage);
		}
  }
}
