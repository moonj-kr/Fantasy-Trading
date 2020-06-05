const League = require('../models').League;
const User = require('../models').User;
const Portfolio = require('../models').Portfolio;
const Invite = require('../models').Invite;
var schedule = require('node-schedule');
const nodemailer = require("nodemailer");
var fs = require('fs');
var handlebars = require('handlebars');


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
function generateInviteKey(){
  const length = 10;
  return Math.random().toString(20).substr(2, length);
}
function scheduleJobs(startDateString, endDateString, leagueID){
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  var leagueRankingJob = schedule.scheduleJob({ start: startDate, end: endDate, rule: '0 0 8 */7 * ?' }, function(){
    console.log('This is where we would call the league ranking api every week!');
  });
  var globalRankingJob = schedule.scheduleJob(endDate, function(){
    console.log('This is where we would call the global ranking api at the end of the league!');
  });
  global.jobs[leagueID+"-league"] = leagueRankingJob;
  global.jobs[leagueID+"-global"] = globalRankingJob;
}
function updateJobs(startDateString, endDateString, leagueID){
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  let originalLeagueRankingJob = global.jobs[leagueID+"-league"];
  let originalGlobalRankingJob = global.jobs[leagueID+"-global"];
  originalLeagueRankingJob.cancel();
  originalGlobalRankingJob.cancel();
  var newLeagueRankingJob = schedule.scheduleJob({start: startDate, end: endDate, rule: '0 0 8 */7 * ?'}, function(){
    console.log('This is where we would call the league ranking api every week!');
  });
  var newGlobalRankingJob = schedule.scheduleJob(endDate, function(){
    console.log('This is where we would call the global ranking api at the end of the league!');
  });
  global.jobs[leagueID+"-league"] = newLeagueRankingJob;
  global.jobs[leagueID+"-global"] = newGlobalRankingJob;

}
function sendEmail(email, firstName, leagueName){
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '9611e4ce3d32bc', // generated mailtrap user
        pass: 'd70743dcdd9f9a', // generated mailtrap password
      },

      // service: "Gmail",
      // auth: {
      //   user: "fantasytrading2020",
      //   pass: "ritswen2020"
      // }
    });
    readHTMLFile(__dirname + '/email.html', function(err, html) {
      var template = handlebars.compile(html);
      var replacements = {
           firstName: firstName,
           leagueName: leagueName
      };
      var htmlToSend = template(replacements);
      let mailOptions = {
        from: '"Fantasy Trading" <fantasytrading2020@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "You've been invited to join " + leagueName, // Subject line
        text: firstName + " has invited you to join their league " + leagueName + "! \nCompete with your friends and show off your stock trading skills! \nPlease click the link below to accept their invite" , // plain text body
        html: htmlToSend
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      });
    });
  });
}

module.exports = {
  listDetails(req, res){
    const leagueName = req.params.leagueName;
    return League.findOne({where: {name: leagueName}}).then(league => {
      res.status(200).send(league);
    }).catch(error => {
      console.error(error);
      res.status(400).send({message: "league does not exist"});
    })
  },
  update(req,res){
    const sessionID = req.sessionID;
    User.findOne({where: {sessionID: sessionID}}).then(user => {
      Portfolio.findOne({where: {userID: user.id, leagueID: req.body.id}}).then(portfolio => {
        if(portfolio.host == true){
          League.update({
            name: req.body.name,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            investmentFunds: req.body.investmentFunds
          }, {where: {id: req.body.id}}).then((updatedCount) => {
            updateJobs(req.body.startDate, req.body.endDate, req.body.id);
            res.status(200).send({updatedCount: updatedCount});
          }).catch(error => {console.error(error)});
        }
        else{
          res.status(403).send({message: "Only host user can make updates to league"})
        }
      }).catch(error => {console.error(error)});
    }).catch(error => {
      console.error(error);
      let message;
      if(!error.errors){
        message = "User must be logged in"
      }
      else{
        message = error.errors[0].message
      }
      res.status(400).send({message: message});
    });
  },
  delete(req, res){
    const sessionID = req.sessionID;
    User.findOne({where: {sessionID: sessionID}}).then(user => {
      Portfolio.findOne({where: {userID: user.id, leagueID: req.body.id}}).then(portfolio => {
        if(portfolio.host == true){
          League.destroy({where: {id: req.body.id}}).then(isDeleted => {
            res.status(200).send({isDeleted: isDeleted});
          }).catch(error => {console.error(error)});
        }
        else{
          res.status(403).send({message: "Only host user can delete a league"})
        }
      }).catch(error => {console.error(error)});
    }).catch(error => {
      console.error(error);
      res.status(400).send({message: "User must be logged in"});
    });
  },
  list(req, res){
    return League.findAll().then((leagues) => {res.status(200).send(leagues)}).catch(error => {res.status(400).send(error)})
  },
  create(req, res) {
    const invitationKey = generateInviteKey();
    const sessionID = req.sessionID;
    return League.create({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      investmentFunds: req.body.investmentFunds,
      invitationKey: invitationKey
    }).then(league => {
      User.findOne({where: {sessionID: sessionID}}).then(user => {
        Portfolio.create({
          value: 0,
          buyingPower: req.body.investmentFunds,
          percentChange: 0,
          host: true,
          ranking: null
        }).then(portfolio => {
          portfolio.setLeague(league);
          portfolio.setUser(user);
        }).catch(error => console.error(error));
      }).catch(error => console.error(error));
      scheduleJobs(req.body.startDate, req.body.endDate, league.id);
      res.status(200).send(league);
    }).catch(error => {
      console.error(error);
      let message;
      if(!error.errors){
        message = "User must be logged in"
      }
      else{
        message = error.errors[0].message
      }
      res.status(400).send({message: message});
    });
  },
  sendInvite(req, res){
    const sessionID = req.sessionID;
    const invitationKey = req.body.invitationKey;
    const emails = req.body.emails;
    console.log(emails);
    User.findOne({where: {sessionID: sessionID}}).then(user => {
      League.findOne({where: {invitationKey: invitationKey}}).then(league => {
        Portfolio.findOne({where: {leagueID: league.id, userID: user.id}}).then(portfolio => {
          if(portfolio.host == true){
            emails.forEach((address, i) => {
              sendEmail(address, user.firstName, league.name);
              User.findOne({where:{email: address}}).then(user => {
                let status;
                if(user){
                  status = 'Pending';
                }
                else{
                  status = 'No Account';
                }
                Invite.findOrCreate({where: {email: address, invitationKey: invitationKey, status: status}}).then((invite, created) => {
                  console.log('invite Successfully created')
                }).catch(error => console.error(error));
              }).catch(error => {console.error(error)});
            });
            res.status(200).send({invitationKey: invitationKey});
          }
          else{
            res.status(403).send({message: "only host user can send invites to league"})
          }
        }).catch(error => {console.error(error)});
      }).catch(error => {res.send(400).send({message: "cannot find league"})});
    }).catch(error => {
      console.error(error);
      let message;
      if(!error.errors){
        message = "User must be logged in"
      }
      else{
        message = error.errors[0].message
      }
      res.status(400).send({message: message});
    });
  },
};
