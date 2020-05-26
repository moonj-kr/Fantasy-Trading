const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const bcrypt = require("bcrypt");

module.exports = {
  list(req, res) {
    return models.User
      .findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => res.status(400).send(error));
  },
  get_register(req, res){
    res.render('registration');
  },
  post_register(req, res) {
    let salt = config.salt;
    bcrypt.hash(salt + req.body.password, 10, function(err, hash){
      console.log(req.sessionID)
      models.User.create({
        username: req.body.username,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        points: req.body.points,
        sessionID: req.sessionID,
      }).then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error));
    });
  },
  get_login(req, res){
    res.render('login');
  },
  post_login(req, res){
    //const sessionID =
  },
  logout(req, res){

  },
  leagues(req, res){

  }
  // login(req, res){
  //   return User
  //     .findOne({where: {username: req.body.username, password: req.body.password}})
  //     .then((user) =>
  //       user.update({sessionId: req.session.id})
  //       res.status(200).send(user);
  //     )
  //     .catch((error) => res.status(400).send(error))
  // }
};
