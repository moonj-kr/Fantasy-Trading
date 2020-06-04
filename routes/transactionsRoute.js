const transactionsController = require('../controllers').transactionsController;

module.exports = (app) => {
  /**
    * @swagger
    * /api/transaction:
    *   post:
    *     tags:
    *       - Transactions
    *     name: Make Transaction
    *     summary: makes a transaction
    *     responses:
    *       200:
    *         description: Successfully creates a transaction record in the Transactions table and updates portfolio.
   */
  app.post('/api/transaction', transactionsController.makeTransaction); 
  
  /**
    * @swagger
    * /api/transactions/{leagueID}:
    *   get:
    *     tags:
    *       - Transactions
    *     name: Get Transactions
    *     summary: gets all transactions 
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: int
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Successfully gets all transactions for a user in a league
   */
  app.get('/api/transactions/:leagueID', transactionsController.getTransactions);
  
  // app.delete('api/deleteTransactions', transactionController.deleteTransactions);
};
