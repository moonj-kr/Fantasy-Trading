const leaguesController = require('../controllers').leaguesController;
module.exports = (app) => {
  app.post('/api/leagues/create', leaguesController.create);
  app.post('/api/leagues/sendInvite', leaguesController.sendInvite);
  app.get('/api/leagues/list', leaguesController.list);
  //app.post('/api/login', usersController.login)
}
