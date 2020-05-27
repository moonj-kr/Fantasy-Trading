const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const bcrypt = require("bcrypt");
const {QueryTypes} = require('sequelize');

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
  post_register_invite(req, res){

  },
  get_login(req, res){
    res.render('login');
  },
  post_login(req, res){
    let salt = config.salt;
    models.User.findOne({where: {email: req.body.email}}).then(function(user) {
      //if email is not registered redirect to login page
      if (!user){res.redirect('/api/users/login');}
      else{
        bcrypt.compare(salt + req.body.password, user.password, function(err, result){
          if (result == true){
            console.log(req.sessionID);
            user.sessionID = req.sessionID;
            user.save();
            //Set invitation status to 'accepted' if invitationKey was passed in
            if(req.body.invitationKey){
              models.Invite.findOne({where: {email: user.email, invitationKey: req.body.invitationKey}}).then(invite => {
                invite.status = 'Accepted';
                invite.save();
              });
            }
            res.status(200).send(user);
          }
          else{
            res.status(403).send('Incorrect password');
            //res.redirect('/api/users/login');
          }
        });
      }
    }).catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
  },
  logout(req, res){
    //const sessionID = "87xkHGA96a-2J_ZTBxOJzNeivSAIY1y2";
    models.User.findOne({where: {sessionID: req.sessionID}}).then(user => {
      user.sessionID = null;
      user.save();
      res.status(200).send('Logged out');
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });
  },
  leagues(req, res){
    models.User.findOne({where: {sessionID: req.sessionID}}).then(user => {

    })
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
