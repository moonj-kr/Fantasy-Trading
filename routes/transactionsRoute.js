const transactionController = require('../controllers').transactionController;

module.exports = (app) => {
  app.get('/api/stocks', transactionController.getAllStocks);
  app.get('/api/stocks/:symbol', transactionController.getStockData);
  app.post('api/portfolios/:id', transactionController.getAllPortfolios);
};
