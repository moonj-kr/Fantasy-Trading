const usersController = require('../controllers').usersController;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Fantasy Trading API!',
  }));

  app.get('/api/users', usersController.list);

};
