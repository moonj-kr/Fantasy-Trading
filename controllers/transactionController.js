const Stock = require('../models').Stock;
const Portfolio = require('../models').Portfolio
const League = require('../models').League

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
  
  getAllPortfolios(req,res) {
    return Portfolio
      .findAll()
      .then(portolios => res.status(200).send(portolios))
      .catch(error => res.status(400).send(error))
  },
  
  // confused here
  calculatePortfolioValue(req,res) {
    let portfolioValue;
    let shares
    const leagueId = req.params.id;
    return Portfolio
      .findOne({where: {leagueID: leagueId}})
      .then(portfolio => {
        
      })
      .catch(error => res.status(400).send(error));
  }
  
};