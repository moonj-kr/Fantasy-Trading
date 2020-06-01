// Start server

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

//express session
app.use(cookieParser());
app.use(session({
  secret: '34SDgsdgspxxxxxxxdfsG', //long rand STRING
  resave: false,
  saveUninitialized: true
}));

app.use(logger('dev'));
// make uploads publicly accessible to render profile pictures
app.user('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
global.jobs = {};

require('./routes')(app);

// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to the beginning of nothingness.',
// }));
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)
})
module.exports = app;
