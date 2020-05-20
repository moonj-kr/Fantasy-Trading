const League = require('../models').League;
const User = require('../models').User;
const Portfolio = require('../models').Portfolio;
const Invite = require('../models').Invite;
var schedule = require('node-schedule');
const nodemailer = require("nodemailer");


function generateInviteKey(){
  const length = 10;
  return Math.random().toString(20).substr(2, length);
}
function scheduleJobs(startDateString, endDateString){
  var startDate = new Date(startDateString);
  var endDate = new Date(endDateString);
  var leagueRankingJob = schedule.scheduleJob({ start: startDate, end: endDate, rule: '*****7' }, function(){
    console.log('This is where we would call the league ranking api every week!');
  });
  var globalRankingJob = schedule.scheduleJob(endDate, function(){
    console.log('This is where we would call the global ranking api at the end of the league!');
  });
}
function sendEmail(email, firstName, leagueName){
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "fantasytrading2020",
        pass: "ritswen2020"
      }
    });
    let mailOptions = {
      from: '"Fantasy Trading" <fantasytrading2020@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "You've been invited to join " + leagueName, // Subject line
      text: firstName + " has invited you to join their league " + leagueName + "! \n Compete with your friends and show off your stock trading skills! \n Please click the link below to accept their invite" , // plain text body
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
}

module.exports = {
  list(req, res){
    return League.findAll().then((leagues) => {res.status(200).send(leagues)}).catch(error => {res.status(400).send(error)})
  },
  create(req, res) {
    const invitationKey = generateInviteKey();
    const sessionID = "12345abcde";
    return League.create({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      investmentFunds: req.body.investmentFunds,
      invitationKey: invitationKey
    }).then(league => {
      User.findOne({where: {sessionID: sessionID}}).then(user => {
        Portfolio.create({
          value: req.body.investmentFunds,
          host: true,
          ranking: null
        }).then(portfolio => {
          portfolio.setLeague(league);
          portfolio.setUser(user);
        }).catch(error => console.error(error));
      }).catch(error => console.error(error));
      scheduleJobs(req.body.startDate, req.body.endDate);
      res.status(200).send(league);
    }).catch(error => console.error(error));
  },
  sendInvite(req, res){
    const sessionID = "12345abcde";
    const invitationKey = req.body.invitationKey;
    const emails = req.body.emails;
    console.log(emails);
    User.findOne({where: {sessionID: sessionID}}).then(user => {
      League.findOne({where: {invitationKey: invitationKey}}).then(league => {
        Portfolio.findOne({where: {leagueID: league.id, userID: user.id}}).then(portfolio => {
          if(portfolio.host == true){
            emails.forEach((address, i) => {
              sendEmail(address, user.firstName, league.name);
              Invite.findOrCreate({where: {email: address, invitationKey: invitationKey}}).then((invite,created) => {
                User.findOne({where: {email: address}}).then(user => {
                  if(user){
                    invite.status = 'Pending';
                  }
                  else{
                    invite.status = 'No Account';
                  }
                }).catch(error => {console.error(error)});
              }).catch(error => {console.error(error)});
            });
            res.status(200).send(portfolio)
          }
        }).catch(error => {console.error(error)});
      }).catch(error => {console.error(error)});
    }).catch(error => {console.error(error)});
  }
};
