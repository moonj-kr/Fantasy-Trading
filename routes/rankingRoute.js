const rankingController = require('../controllers').rankingController;

module.exports = (app) => {
 
  /**
    * @swagger
    * /api/ranking/leagueRankings/{leagueID}:
    *   get:
    *     tags:
    *       - Ranking
    *     name: List League Rankings
    *     summary: Gets the userID, value, and ranking of each portfolio within a specific league
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Sucessfully returns the userID, value, and ranking of each portfolio within a specific league
  */
  app.get('/api/ranking/leagueRankings/:leagueID', rankingController.leagueRankings);

  /**
    * @swagger
    * /api/ranking/globalRankings:
    *   get:
    *     tags:
    *       - Ranking
    *     name: List Global Rankings
    *     summary: Gets the points and userID for each user in all leagues
    *     responses:
    *       200:
    *         description: Sucessfully returns the points and userID for each user in all leagues
  */
  app.get('/api/ranking/globalRankings', rankingController.globalRankings);

  /**
    * @swagger
    * /api/ranking/updateLeagueRankings/{leagueID}:
    *   post:
    *     tags:
    *       - Ranking
    *     name: Update League Rankings
    *     summary: Updates rankings within a specific league to match the profit made by each user
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Sucessfully updates rankings within a specific league
  */
  app.get('/api/ranking/updateLeagueRankings/:leagueID', rankingController.updateLeagueRankings);

  /**
    * @swagger
    * /api/ranking/updateGlobalRankings/{leagueID}:
    *   post:
    *     tags:
    *       - Ranking
    *     name: Update Global Rankings
    *     summary: Updates global points for all users within a specific league to match their final placing within a specific league
    *     parameters:
    *       - in: path
    *         name: leagueID
    *         schema:
    *           type: string
    *         required:
    *           - leagueID
    *     responses:
    *       200:
    *         description: Sucessfully updates global points for all users within a specific league
  */
  app.post('/api/ranking/updateGlobalRankings/:leagueID', rankingController.updateGlobalRankings);
}
