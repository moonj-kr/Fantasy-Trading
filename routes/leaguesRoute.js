const leaguesController = require('../controllers').leaguesController;
module.exports = (app) => {
  app.get('/api/leagues/participants/:leagueName', leaguesController.participants);
  app.get('/api/leagues/list/:leagueName', leaguesController.listDetails);
  app.get('/api/leagues/list', leaguesController.list);
  app.post('/api/leagues/create', leaguesController.create);
  app.post('/api/leagues/sendInvite', leaguesController.sendInvite);
  app.post('/api/leagues/update', leaguesController.update);
  app.delete('/api/leagues/delete', leaguesController.delete);
}
