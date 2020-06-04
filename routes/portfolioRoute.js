const portfolioController = require('../controllers').portfolioController;

module.exports = (app) => {
  /**
    * @swagger
    * /api/portfolio/getPortfolio/{leagueID}:
    *   get:
    *     name: GET Portfolio
    *     summary: Gets portfolio by session id and league id
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Sucessfully returns portfolio
    */
	app.get('/api/portfolio/getPortfolio/:leagueID', portfolioController.getPortfolio);

  /**
    * @swagger
    * /api/portfolio/getAllTransactions/{portfolioID}:
    *   get:
    *     name: GET all transactions
    *     summary: gets all transactions of a specified portfolio id
    *     parameters:
    *       - in: path
    *         name: portfolioID
    *         schema:
    *           type: string
    *         required:
    *           - portfolioID
    *     responses:
    *       200:
    *         description: Sucessfully returns all transactions of a portfolio
    */
	app.get('/api/portfolio/getAllTransactions/:portfolioID', portfolioController.getAllTransactions);

  /**
    * @swagger
    * /api/portfolio/getTransactions/{leagueID}:
    *   get:
    *     name: Participants
    *     summary: gets the number of participants in a league
    *     parameters:
    *       - in: path
    *         name: leagueName
    *         schema:
    *           type: string
    *         required:
    *           - leagueName
    *     responses:
    *       200:
    *         description: Sucessfully returns number of particpants in league
    */
	app.get('/api/portfolio/getTransactions/:leagueID', portfolioController.getTransactions);
  /**
    * @swagger
    * /api/portfolio/testScheduleJob:
    *   get:
    *     name: Participants
    *     summary: gets the number of participants in a league
    *     parameters:
    *       - in: path
    *         name: leagueName
    *         schema:
    *           type: string
    *         required:
    *           - leagueName
    *     responses:
    *       200:
    *         description: Sucessfully returns number of particpants in league
    */
	app.get('/api/portfolio/testScheduleJob', portfolioController.testScheduleJob);

  /**
    * @swagger
    * /api/portfolio/getCurrentBalance/{leagueID}:
    *   get:
    *     name: Participants
    *     summary: gets the number of participants in a league
    *     parameters:
    *       - in: path
    *         name: leagueName
    *         schema:
    *           type: string
    *         required:
    *           - leagueName
    *     responses:
    *       200:
    *         description: Sucessfully returns number of particpants in league
    */
	app.get('/api/portfolio/getCurrentBalance/:leagueID', portfolioController.getCurrentBalance);
}
