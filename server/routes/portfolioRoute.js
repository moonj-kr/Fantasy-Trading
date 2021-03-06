const portfolioController = require('../controllers').portfolioController;

module.exports = (app) => {
	app.put('/api/portfolio/extScheduleJob', portfolioController.extScheduleJob);

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
    * /api/portfolio/getStockDetails/{leagueID}:
    *   get:
    *     name: GETS list of transactions
    *     summary: gets the number of participants in a league
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Sucessfully returns number of particpants in league
    */
	app.get('/api/portfolio/getStockDetails/:leagueID', portfolioController.getStockDetails);

	/**
    * @swagger
    * /api/portfolio/getCurrentBalance/{leagueID}:
    *   get:
    *     name: Participants
    *     summary: gets the number of participants in a league
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Sucessfully returns number of particpants in league
    */
	app.get('/api/portfolio/getCurrentBalance/:leagueID', portfolioController.getCurrentBalance);
	/**
    * @swagger
    * /api/portfolio/prevValues/{leagueID}:
    *   get:
    *     name:
    *     summary: gets the array of previous portfolio values
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: successfully returns the previous portfolio values
    */
	app.get('/api/portfolio/prevValues/:leagueID', portfolioController.getPreviousValues);
  
	/**
    * @swagger
    * /api/stock/price/{symbol}:
    *   get:
    *     name:
    *     summary: gets the current price and previous close price of stock
    *     parameters:
    *       - in: path
    *         name: symbol
    *         schema:
    *           type: string
    *         required:
    *           - symbol
    *     responses:
    *       200:
    *         description: successfully returns the stock stock price
    */
		app.get('/api/stock/price/:symbol', portfolioController.getStockPrice);

	/**
    * @swagger
    * /api/portfolio/getDates/{leagueID}:
    *   get:
    *     name:
    *     summary: gets the array of previous portfolio date values
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: successfully returns the previous portfolio date values
    */
		app.get('/api/portfolio/getDates/:leagueID', portfolioController.getDates);

		/**
			* @swagger
			* /api/stock/shares/{leagueID}/{symbol}:
			*   get:
			*     name:
			*     summary: gets the number of held shares of stock
			*     parameters:
			*       - in: path
			*         name: leagueID
			*         schema:
			*           type: string
			*         required:
			*           - leagueID
			*       - in: path
			*         name: symbol
			*         schema:
			*           type: string
			*         required:
			*           - symbol
			*     responses:
			*       200:
			*         description: successfully returns the number of shares of stock
			*/
			app.get('/api/stock/shares/:leagueID/:symbol', portfolioController.getNumberOfShares);
}
