const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const bcrypt = require("bcrypt");
const {QueryTypes} = require('sequelize');
const Sequelize = require('sequelize');
var leagues = [];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}

module.exports = {
  list(req, res) {
    return models.User
      .findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => res.status(400).send(error));
  },
  register(req, res) {
    let salt = config.salt;
    bcrypt.hash(salt + req.body.password, 10, function(err, hash){
      models.User.create({
        username: req.body.username,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        points: 0,
        sessionID: req.sessionID,
      }).then(user => {
        //invitationKey passed in if registration triggered from invitation email
        if(req.body.invitationKey){
          //Update invitation status
          models.Invite.findOne({where: {email: user.email, invitationKey: req.body.invitationKey}}).then(invite => {
            invite.status = 'Accepted';
            invite.save();
          }).catch(error => console.error(error));
          //Create new portfolio
          models.League.findOne({where: {invitationKey: req.body.invitationKey}}).then(league => {
            models.Portfolio.create({
              value: league.investmentFunds,
              host: false,
              ranking: null
            }).then(portfolio => {
              portfolio.setLeague(league);
              portfolio.setUser(user);
            }).catch(error => console.error(error));
          }).catch(error => console.error(error));
        }
        res.status(201).send(user)
      }).catch(error => res.status(400).send(error));
    });
  },
  async login(req, res){
    let salt = config.salt;
    let user;
    if(req.body.username){
      user = await models.User.findOne({where: {username: req.body.username}});
    }
    else if (req.body.email) {
      user = await models.User.findOne({where: {email: req.body.email}});
    }
    //if email is not registered redirect to login page
    if (!user){res.redirect('/api/users/login');}
    else{
      bcrypt.compare(salt + req.body.password, user.password, function(err, result){
        if (result == true){
          console.log(req.sessionID);
          user.sessionID = req.sessionID;
          user.save();
          //invitationKey passed in if login triggered from invitation email
          if(req.body.invitationKey){
            //Update invitation status
            models.Invite.findOne({where: {email: user.email, invitationKey: req.body.invitationKey}}).then(invite => {
              invite.status = 'Accepted';
              invite.save();
            }).catch(error => console.error(error));
            //Create new portfolio
            models.League.findOne({where: {invitationKey: req.body.invitationKey}}).then(league => {
              models.Portfolio.create({
                value: league.investmentFunds,
                host: false,
                ranking: null
              }).then(portfolio => {
                portfolio.setLeague(league);
                portfolio.setUser(user);
              }).catch(error => console.error(error));
            }).catch(error => console.error(error));
          }
          res.status(200).send(user);
        }
        else{
          res.status(403).send('Incorrect password');
          //res.redirect('/api/users/login');
        }
      });
    }
  },
  logout(req, res){
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
    sequelize.query(`SELECT "name" FROM "Leagues" l INNER JOIN "Portfolios" p ON "l"."id" =
        "p"."leagueID" INNER JOIN "Users" u ON "p"."userID" = "u"."id" WHERE "u"."sessionID" =
        '${req.sessionID}'`, { type: QueryTypes.SELECT }).then(leagues => {
        res.status(200).send(leagues);
      }).catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  },
  details(req, res){
    models.User.findOne({where: {sessionID: req.sessionID}}).then(user =>{
      res.status(200).send(user);
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    })
  },
  edit(req, res){

  }
};
