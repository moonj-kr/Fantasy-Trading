const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const bcrypt = require("bcrypt");
const {QueryTypes} = require('sequelize');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');

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
        profilePicture: path.resolve(__dirname, '../../', 'server\\uploads\\default-avatar.jpg')
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
              value: 0,
              buyingPower: league.investmentFunds,
              percentChange: 0,
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
    //User is not registered
    if (!user){res.status(400).send('User not registered');}
    else{
      bcrypt.compare(salt + req.body.password, user.password, function(err, result){
        if (result == true){
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
                value: 0,
                buyingPower: league.investmentFunds,
                percentChange: 0,
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
          res.status(400).send('Incorrect password');
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
    sequelize.query(`SELECT "l"."id","name","startDate","endDate","invitationKey","investmentFunds" FROM "Leagues" l INNER JOIN "Portfolios" p ON "l"."id" =
        "p"."leagueID" INNER JOIN "Users" u ON "p"."userID" = "u"."id" WHERE "u"."sessionID" =
        '${req.sessionID}'`, { type: QueryTypes.SELECT }).then(leagues => {
        res.status(200).send(leagues);
      }).catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  },
  getUser(req, res){
    models.User.findOne({where: {sessionID: req.sessionID}}).then(user =>{
      res.status(200).send(user);
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    })
  },
  updateUser(req, res){
    models.User.findOne({where: {sessionID: req.sessionID}}).then(user => {
      user.username = req.body.username;
      user.email= req.body.email;
      user.firstName= req.body.firstName;
      user.lastName= req.body.lastName;
      user.save();
      res.status(200).send(user);
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    })
  },
  uploadProfilePicture(req, res){
    models.User.findOne({where: {sessionID: req.sessionID}}).then(user =>{
      if (! req.file || ! req.file.path) {
        return res.status(400).send(error);
      }
      //remove old profile picture
      if(user.profilePicture){
        if(!user.profilePicture.includes("default-avatar")){
          fs.unlinkSync(path.resolve(__dirname, '../../', user.profilePicture));
        }
      }
      user.profilePicture = req.file.path;
      user.save()
      res.status(200).send({message: "ProfilePicture successfully uploaded"});
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    })
  },
  async getProfilePicture(req, res){
    let user;
    // Retrieve profile picture of other participants
    if(req.body.username){
      user = await models.User.findOne({where: {username: req.body.username}});
    }
    else if (req.body.email) {
      user = await models.User.findOne({where: {email: req.body.email}});
    }
    // Retrieve profile picture for current session
    else if (req.sessionID){
      user = await models.User.findOne({where: {sessionID: req.sessionID}});
    }
    else{
      res.status(400).send({message: "User must be logged in"});
    }

    // Check if user has uploaded a profile picture
    if(user.profilePicture){
      res.status(200).sendFile(path.resolve(__dirname, '../../', user.profilePicture))
    }
    // Send default avatar if no current profile picture path exists
    else{
      res.status(200).sendFile('\\uploads\\default-avatar.jpg', {root: path.resolve(__dirname, '../')})
    }

  },
  async updatePassword(req, res){
    let salt = config.salt;
    let user;
    if(req.sessionID){
      user = await models.User.findOne({where: {sessionID: req.sessionID}});
    } else {
      res.status(400).send({message: "User must be logged in"});
    }

    bcrypt.compare(salt + req.body.oldPassword, user.password, function(err, result){
      if (result == true){
        bcrypt.hash(salt + req.body.password, 10, function(err, hash){
          user.password = hash;
          user.save();
          res.status(200).send({message: "Password successfully updated"});
        });
      }
      else{
        res.status(403).send('Incorrect password');
      }
    });
  }
};
