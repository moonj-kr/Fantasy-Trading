const transactionController = require('../controllers').transactionController;

module.exports = (app) => {
  app.get('/api/stocks', transactionController.getAllStocks);
  app.get('/api/stocks/:symbol', transactionController.getStockData);
  app.get('api/portfolios', transactionController.getAllPortfolios);
  app.post('api/portfolios/:id', transactionController.calculatePortfolioValue); // id is leagueID
  // Need POST stock data API
};
