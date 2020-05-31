import { formatDate } from '../utils/dates';
import { getRequest } from '../utils/request';

const Portfolio = require('../models').Portfolio;
const League = require('../models').League;
const Transaction = require('../models').Transaction;

module.exports = {
  getTransactions(req,res) {
    const sessionID = 'abcde12345';
    const leagueID = req.body.leagueID;
    return User.findOne({where: {sessionID: sessionID}}).then(user => {
      Portfolio.findOne({
        where: {
          leagueID: leagueID,
          userID: user.id
        }
      }).then(portfolio => {
        Transaction.findAll({
          where: {
            portfolioID: portfolio.portfolioID
          }
        }).then(transactions => {
          res.status(200).send(transactions)
        }).catch(error => {
          res.status(400).send(error)
          console.log(error)
        })
      }).catch(error => {
        res.status(400).send(error)
        console.log(error)
      })
    }).catch(error => {
      res.status(400).send(error)
      console.log(error)
    })
  },
  
  makeTransaction(req,res) {
    const leagueID = req.body.leagueId;
    const sessionID = 'abcde12345';
    // const sessionID = req.sessionId;
    const API_KEY = 'U864TMWAO0GRH22S';
    let transactionValue = 0;
    const symbol = req.body.stockSymbol;
    const price = getRequest(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)["05. price"];
    console.log("Symbol: ", symbol);
    console.log("Price: ", price);
    
    return User.findOne({where: {sessionID: sessionID}}).then(user => {

      // Creates a new transaction in the database using information from the request body.
      Transaction.create({
        volume: req.body.volume,
        type: req.body.type,
        datetime: req.body.datetime,
        price: price,
        stockSymbol: symbol,
        portfolioID: req.body.portfolioID
      }).then((newTransaction,error) => {
        
        // Get portfolio by leagueID, then use the new transaction to update the portfolio value.
        Portfolio.findOne({
          where: {
            leagueID: leagueID, 
            userID: user.id
          }
        }).then(portfolio => {
          
          // The transaction value will be positive or negative based on the transaction type.
          transactionValue = newTransaction.type === 'buy' 
            ? newTransaction.volume * newTransaction.price 
            : newTransaction.volume * newTransaction.price * -1;
          
            // Provides a check to see if the transaction will result in a day trade.
            // Goes through all transactions in the portfolio found by leagueID.
            // For each transaction, checks if a stock was bought or sold today already.
            Transaction.findAll({where: {portfolioID: newTransaction.portfolioID}}).then((transactions,error) => {
              const currDate = formatDate(new Date());
              transactions.forEach(transaction => {
                if (transaction.stockSymbol === newTransaction.stockSymbol && formatDate(transaction.date) === currDate) {
                  res.status(400).send(error);
                }
              })
            });
            
          // Provides a check to see if the transaction can actually be made.
          portfolio.buyingPower - transactionValue < 0 
            ? res.status(400).send(error) 
            : portfolio.buyingPower -= transactionValue;   
            
          // Provide a check so the portfolio does not reach a negative value
          portfolio.value + transactionValue < 0 
            ? res.status(400).send(error) 
            : portfolio.value += transactionValue;
          
          console.log("Transaction value: " + transactionValue);
          console.log("Portfolio value: " + portfolio.value);
          console.log("Buying Power: " + portfolio.buyingPower);
        }).catch(error => {
          console.log(error)
          res.status(400).send(error)
        });
        res.status(200).send(newTransaction)
      }).catch(error => {
        console.log(error)
        res.status(400).send(error)
      });
    });
  }
};