const usersRoute = require('./usersRoute');
const portfolioRoute = require('./portfolioRoute');
const leaguesRoute = require('./leaguesRoute');
const transactionsRoute = require('./transactionsRoute');
const rankingRoute = require('./rankingRoute');

var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'Fantasy Trading Swagger API',
    version: '1.0.0',
    description: 'Endpoints exposed from the Fantasy Trading backend'
  },
  host: 'localhost:5000',
  basepath: '/'
}
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
}
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Fantasy Trading API!',
  }));
  app.get('/swagger.json', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  usersRoute(app),
  portfolioRoute(app),
  transactionsRoute(app),
  leaguesRoute(app)
  rankingRoute(app)
};
