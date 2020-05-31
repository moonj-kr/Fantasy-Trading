const transactionsController = require('../controllers').transactionsController;

module.exports = (app) => {
  /**
   * @swagger
   * /api/transactions/makeTransaction:
   *   get:
   *     name: MakeTransaction
   *     summary: makes a transaction
   *     responses:
   *       200:
   *         description: Successfully creates a transaction record in the Transactions table and updates portfolio.
   */
  app.post('/api/transactions/makeTransaction', transactionsController.makeTransaction); 
  
  // GET transactions by userID in league using leagueID
  /**
   * @swagger
   * /api/transactions/getTransactions:
   *   get:
   *     name: GetTransactions
   *     summary: gets all transactions 
   *     responses:
   *       200:
   *         description: Successfully gets all transactions for a user in a league
   */
  app.get('/api/transactions/getTransactions/:leagueID', transactionsController.getTransactions);
  
  // app.delete('api/deleteTransactions', transactionController.deleteTransactions);
};
