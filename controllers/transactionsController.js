const Portfolio = require('../models').Portfolio;
const League = require('../models').League;
const Transaction = require('../models').Transaction;
const User = require('../models').User;

const get = require('../utils/request').getRequest;
const formatDate = require('../utils/dates').formatDate;
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];

async function getStockData(key,symbol) {
  let stockPrice;
  try {
    stockPrice = await get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`);
  } catch (error) {
    console.log(error)
  }

  return stockPrice.data["Global Quote"]["05. price"];
}

module.exports = {
  getTransactions(req,res) {
    const sessionID = req.sessionID;
    const leagueID = req.params.leagueID;
    return User.findOne({where: {sessionID: sessionID}}).then(user => {
      Portfolio.findOne({
        where: {
          leagueID: leagueID,
          userID: user.id
        }
      }).then(portfolio => {
        if (portfolio === null) {
          res.status(400).send({message: "Transactions do not exist."});
        } else {
          Transaction.findAll({
            where: {
              portfolioID: portfolio.id
            }
          }).then(transactions => {
            res.status(200).send(transactions)
          }).catch(error => {
            res.status(400).send(error)
            console.log(error)
          })
        }
      }).catch(error => {
        res.status(400).send(error)
        console.log(error)
      })
    }).catch(error => {
      res.status(400).send(error)
      console.log(error)
    })
  },

  async makeTransaction(req,res) {
    const league = req.body.leagueID;
    const sessionID = req.sessionID;
    const API_KEY = config.api_key;
    let transactionValue = 0;
    const symbol = req.body.stockSymbol;
    const timeOfTrans = Date.now();
    const price = await getStockData(API_KEY, symbol);


    return User.findOne({where: {sessionID: sessionID}}).then(user => {

      // Get portfolio by leagueID, then use the new transaction to update the portfolio value.
      Portfolio.findOne({
        where: {
          leagueID: league,
          userID: user.id
        }
      }).then(portfolio => {

        // Creates a new transaction in the database using information from the request body.
        Transaction.create({
          volume: req.body.volume,
          type: req.body.type,
          datetime: timeOfTrans,
          price: price,
          stockSymbol: symbol,
          portfolioID: portfolio.id
        }).then(newTransaction => {

          // Determines transaction value based on the transaction type.
          transactionValue = newTransaction.type === 'buy'
            ? newTransaction.volume * newTransaction.price
            : (newTransaction.volume * newTransaction.price) * -1;

          // Provides a check to see if the transaction will result in a day trade.
          // Goes through all transactions in the portfolio found by leagueID.
          // For each transaction, checks if a stock was bought or sold today already.
          Transaction.findAll({where: {portfolioID: portfolio.id}}).then(transactions => {
            const currDate = formatDate(new Date());
            transactions.forEach(transaction => {
              // console.log(transaction);
              if (transaction.stockSymbol === newTransaction.stockSymbol && formatDate(transaction.datetime) === currDate && transaction.type !== newTransaction.type) {
                // res.status(400).send({message: "You are not allowed to day trade."});
                // res.status(400).send(error);
                return res.status(400).json({
                  status: 'error',
                  error: "You are not allowed to day trade."
                })
              }
            })
          });

          // Provides a check to see if there is enough buying power for the transaction.
          if (portfolio.buyingPower - transactionValue < 0) {
            console.log("HERE!")
            // res.status(400).send("There is not enough buying power for this transaction.");
            return res.status(400).json({
              status: 'error',
              error: "There is not enough buying power for this transaction."
            })
          }

          // Provides a check to see if the portfolio does not reach a negative value.
          if (portfolio.value + transactionValue < 0) {
            console.log("HERE!!!")
            return res.status(400).json({
              status: 'error',
              error: "Portfolio value cannot be negative."
            })
          }
          // Update portfolio value and buying power.
          let newBuyingPower = portfolio.buyingPower - transactionValue;
          portfolio.update({buyingPower: newBuyingPower});

          let newPortfolioValue = portfolio.value + transactionValue;
          portfolio.update({value: newPortfolioValue});

          console.log("Transaction value: " + transactionValue);
          console.log("Portfolio value: " + portfolio.value);
          console.log("Buying Power: " + portfolio.buyingPower);
          res.status(200).send(newTransaction)
        });
      }).catch(error => {
        console.log(error)
        res.status(400).send(error)
      });
    }).catch(error => {
      console.log(error)
      res.status(400).send({message: "cannot find user"})
    });
  }
};