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
    let salt = config.salt;
    models.User.findOne({where: {email: req.body.email}}).then(function(user) {
      console.log(user.toJSON());
      //if email is not registered redirect to login page
      if (!user){res.redirect('/api/users/login');}
      else{
        console.log("Compare hash");
        bcrypt.compare(salt + req.body.password, user.password, function(err, result){
          if (result == true){
            console.log(req.sessionID);
            user.sessionID = req.sessionID;
            user.save();
            res.send('Correct password');
          }
          else{
            res.send('Incorrect password');
            //res.redirect('/api/users/login');
          }
        });
      }
    }).catch(error => console.error(error));
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
