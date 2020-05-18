const usersController = require('../controllers').usersController;

module.exports = (app) => {
  app.get('/api/users', usersController.list);
  //app.post('/api/login', usersController.login)
}
