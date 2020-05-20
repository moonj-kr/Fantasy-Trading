const leaguesController = require('../controllers').leaguesController;
module.exports = (app) => {
  app.get('/api/leagues/create', leaguesController.create);
  //app.post('/api/login', usersController.login)
}
