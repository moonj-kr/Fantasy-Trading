const Stock = require('../models').Stock;
const Portfolio = require('../models').Portfolio;
const League = require('../models').League;
const Tranasaction = require('../models').Transaction;

module.exports = {
  
  getAllStocks(req,res) {
    return Stock
      .findAll()
      .then(stocks => res.status(200).send(stocks))
      .catch(error => res.status(400).send('Get all stocks error: ', error))
  },
  
  getStockData(req,res) {
    const symbol = req.params.symbol.toUpperCase()
    return Stock
      .findOne({where: {symbol: symbol}})
      .then(stock => {
        if (stock.isUpdated === false) {
          // HERE: POST StockDataAPI (ProcessStockData) to update stock price based on previous close
          // Update stock price using stock.update()
          
          const date = new Date(Date.now())
          stock.update({
            isUpdated: true,
            updatedAt: date
          })
          .then(() => res.status(200).send(`Stock ${symbol} has been updated.`))
        } else {
          res.status(200).send(stock)
        }
      })
      .catch(error => res.status(400).send(error));
  },
  
  makeTransaction(req,res) {
    const leagueId = req.body.leagueId; // may need to check where this leagueID is coming from in the frontend.
    let transactionValue;
    return Transaction
      // Create a new transaction in the database using information from the request body.
      .create({
        volume: req.body.volume,
        price: req.body.price,
        type: req.body.type,
        stockID: req.body.symbol
      }).then(transaction => {
        // Get portfolio by leagueID, then use the transaction to update the portfolio value.
        Portfolio.findOne({where: {leagueID: leagueId}}).then(portfolio => {
          transactionValue = transaction.type === 'buy' ? transaction.volume * transaction.price : transaction.volume * transaction.price * -1;
          portvolio.value + transactionValue < 0 ? portfolio.value = 0 : portfolio.value += transactionValue;
          console.log("Transaction value: " + transactionValue);
          console.log("Portfolio value: " + portfolio.value);
        }).catch(error => {
          console.log(error)
          res.status(400).send(error)
        })
        res.status(200).send(transaction)
      }).catch(error => {
        console.log(error)
        res.status(400).send(error)
      });
  }
};