const Stock = require('../models').Stock;

module.exports = {
  getAllStocks(req,res) {
    return Stock
    .findAll()
    .then(stocks => res.status(200).send(stocks))
    .catch(error => res.status(400).send(error))
  },
  getStockData(req,res) {
    return Stock
    .findOne({where: {symbol: (req.params.symbol).toUpperCase()}})
    .then(stock => {
      if (stock.isUpdated === false) {
        // POST StockDataAPI (ProcessStockData) to update stock price based on previous close
        
      } else {
        res.status(200).send(stock)
      }
    })
    .catch(error => res.status(400).send(error));
  },
  calculatePortfolio(req,res) {
    
    
  }
};