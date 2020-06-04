// Start server

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)
})
module.exports = app;
