const leaguesController = require('../controllers').leaguesController;

module.exports = (app) => {
  /**
    * @swagger
    * /api/leagues/participants/{leagueName}:
    *   get:
    *     tags:
    *       - Leagues
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
  app.get('/api/leagues/participants/:leagueName', leaguesController.participants);
  /**
    * @swagger
    * /api/leagues/list/{leagueName}:
    *   get:
    *     tags:
    *       - Leagues
    *     name: List Details
    *     summary: shows all details of a specific league
    *     parameters:
    *       - in: path
    *         name: leagueName
    *         schema:
    *           type: string
    *         required:
    *           - leagueName
    *     responses:
    *       200:
    *         description: Sucessfully returns details of league
  */
  app.get('/api/leagues/list/:leagueName', leaguesController.listDetails);
  /**
    * @swagger
    * /api/leagues/list:
    *   get:
    *     tags:
    *       - Leagues
    *     name: List Leagues
    *     summary: shows all the leagues in the system
    *     responses:
    *       200:
    *         description: Sucessfully lists all leagues
  */
  app.get('/api/leagues/list', leaguesController.list);
  /**
    * @swagger
    * /api/leagues/create:
    *   post:
    *     tags:
    *       - Leagues
    *     summary: Create League
    *     consumes:
    *       - application/json
    *     parameters:
    *       - in: body
    *         name: name
    *         type: string
    *         description: A league's name
    *       - in: body
    *         name: startDate
    *         type: string
    *         description: Start date of the league
    *       - in: body
    *         name: endDate
    *         type: string
    *         description: end date of the league
    *       - in: body
    *         name: investmentFunds
    *         type: number
    *         description: initial investment amount
    *     responses:
    *       200:
    *         description: Successfully creates a new league
  */
  app.post('/api/leagues/create', leaguesController.create);
  /**
    * @swagger
    * /api/leagues/sendInvite:
    *   post:
    *     tags:
    *       - Leagues
    *     summary: Send Invites To League
    *     consumes:
    *       - application/json
    *     parameters:
    *       - in: body
    *         name: emails
    *         type: array
    *         description: List of emails to send invites to
    *       - in: body
    *         name: invitationKey
    *         type: string
    *         description: invitation key of league
    *     responses:
    *       200:
    *         description: Successfully sends invites to league
  */
  app.post('/api/leagues/sendInvite', leaguesController.sendInvite);
  /**
    * @swagger
    * /api/leagues/update:
    *   post:
    *     tags:
    *       - Leagues
    *     summary: Updates league
    *     consumes:
    *       - application/json
    *     parameters:
    *       - in: body
    *         name: id
    *         type: integer
    *         description: id of league in database
    *       - in: body
    *         name: name
    *         type: string
    *         description: A league's name
    *       - in: body
    *         name: startDate
    *         type: string
    *         description: Start date of the league
    *       - in: body
    *         name: endDate
    *         type: string
    *         description: end date of the league
    *       - in: body
    *         name: investmentFunds
    *         type: number
    *         description: initial investment amount
    *     responses:
    *       200:
    *         description: Successfully updates league
    *       403:
    *         description: User executing this api is not a host user
  */
  app.post('/api/leagues/update', leaguesController.update);
  /**
    * @swagger
    * /api/leagues/delete:
    *   delete:
    *     tags:
    *       - Leagues
    *     name: Delete League
    *     summary: deletes league from system
    *     consumes:
    *       - application/json
    *     parameters:
    *       - in: body
    *         name: id
    *         type: integer
    *         description: id of league in database
    *     responses:
    *       200:
    *         description: Sucessfully lists all leagues
    *       403:
    *         description: User executing this api is not a host user
  */
  app.delete('/api/leagues/delete', leaguesController.delete);
}
