const usersController = require('../controllers').usersController;
module.exports = (app) => {
  app.get('/api/users', usersController.list);

  app.get('/api/users/register', usersController.get_register);
  app.get('/api/users/login', usersController.get_login);

  app.post('/api/users/register', usersController.post_register);
  app.post('/api/users/login', usersController.post_login);
  app.get('/api/users/logout', usersController.logout);
  app.get('/api/users/leagues', usersController.leagues);
}
