const transactionController = require('../controllers').transactionController;

module.exports = (app) => {
  /**
   * @swagger
   * /api/makeTransaction
   *   get:
   *     name: MakeTransaction
   *     summary: makes a transaction
   *     responses:
   *       200:
   *         description: Successfully creates a transaction record in the Transactions table and updates portfolio.
   */
  app.post('api/makeTransaction', transactionController.makeTransaction); 
  
  // GET transactions by userID in league using leagueID
  /**
   * @swagger
   * /api/makeTransaction
   *   get:
   *     name: GetTransactions
   *     summary: gets all transactions 
   *     responses:
   *       200:
   *         description: Successfully gets all transactions for a user in a league
   */
  app.get('api/getTransactions', transactionController.getTransactions);
  
  // app.delete('api/deleteTransactions', transactionController.deleteTransactions);
};
