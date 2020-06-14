// Start server

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const models = require('./models');
const portfolioController = require('./controllers/index.js').portfolioController;
const cors = require('cors');

const app = express();
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
//express session
app.use(cookieParser());
app.use(session({
  secret: '34SDgsdgspxxxxxxxdfsG', //long rand STRING
  resave: false,
  saveUninitialized: true
}));

app.use(logger('dev'));
// make uploads publicly accessible to render profile pictures
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
global.jobs = {};

require('./routes')(app);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)

  //clear sessionIDs on server start
  models.User.findAll().then(users => {
    users.forEach((user, i) => {
      user.sessionID = null;
      user.save();
    });
  }).catch(error => {
    console.log(error);
  });

	// update portfolio
	portfolioController.extScheduleJob();

})
module.exports = app;
