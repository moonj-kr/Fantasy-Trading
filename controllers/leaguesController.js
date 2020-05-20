const League = require('../models').League;
const User = require('../models').User;
const Portfolio = require('../models').Portfolio;
const newLeague = null;
function generateInviteKey(){
  const length = 10;
  return Math.random().toString(20).substr(2, length);
}

module.exports = {
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
      User.findOne({sessionID: sessionID}).then(user => {
        Portfolio.create({
          value: req.body.investmentFunds,
          host: true,
          ranking: null
        }).then(portfolio => {
          portfolio.setLeague(league);
          portfolio.setUser(user);
        }).catch(error => console.error(error));
      }).catch(error => console.error(error));
      res.status(200).send(league);
    }).catch(error => console.error(error));
  }
};
